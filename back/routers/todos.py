#todos.py
# Import necessary modules and classes from FastAPI and Python
from fastapi import APIRouter, Depends
from fastapi import HTTPException, status
from typing import Annotated, List
from models import  AddTasksPayload, Todos
import uuid
from pathlib import Path
from fastapi_mail import FastMail, MessageSchema, MessageType
import asyncio

from .auth import get_current_user
from database import  SessionLocal
from sqlalchemy.orm import Session
# from main import conf  # Import the email configuration from main.py
from fastapi import BackgroundTasks
from datetime import timedelta, datetime
from config import conf

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
ISRAEL_TZ = pytz.timezone('Asia/Jerusalem')


# Create a APIRouter application
router = APIRouter(
    prefix='/todo',
    tags=['todo'])

def get_dataBase():
    dataBase = SessionLocal()
    try:
        yield dataBase
    finally:
        dataBase.close()

dataBase_dependency = Annotated[Session, Depends(get_dataBase)]
user_dependency = Annotated[dict, Depends(get_current_user)]


# Define a GET endpoint to retrieve all tasks from the same user
# get with database
@router.get("/")
async def get_todos_from_db(user:user_dependency, dataBase:dataBase_dependency ):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
    return dataBase.query(Todos).filter(Todos.owner_id == uuid.UUID(user.get('id'))).all()


# Define a GET endpoint to retrieve task by ID
# get with database
@router.get("/{todo_id}")
async def get_todos_from_db_by_id(user:user_dependency, dataBase:dataBase_dependency, todo_id: uuid.UUID ):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")

    todo_model = dataBase.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id == uuid.UUID(user.get('id'))).first()
    if todo_model is not None:
        return todo_model
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")



# Define a function to send emails
async def send_email(email: str, subject: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email],
        body=body,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)


def send_email_sync(email: str, subject: str, body: str):
    # Check if an event loop already exists, and if not, create one
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

    # Run the asynchronous send_email function in the event loop
    loop.run_until_complete(send_email(email, subject, body))

scheduler = BackgroundScheduler()
scheduler.start()


def schedule_email(email: str, subject: str, body: str, send_time: datetime):
    if send_time.tzinfo is None:
        send_time = ISRAEL_TZ.localize(send_time)
    
    utc_time = send_time.astimezone(pytz.UTC)
    local_time = utc_time.astimezone(ISRAEL_TZ)
    try:
        scheduler.add_job(
            func=send_email_sync,
            trigger=DateTrigger(run_date=utc_time),
            args=[email, subject, body]
        )
        print(f"Email job scheduled successfully.")
    except Exception as e:
        print(f"Failed to schedule email job: {e}")

# Define a POST endpoint for creating tasks
# Post with database
@router.post("/")
async def create_todo(user: user_dependency, dataBase:dataBase_dependency,task_payload: AddTasksPayload, background_tasks: BackgroundTasks):
    # Extract title and body from the payload
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")

    todo_model= Todos(**task_payload.dict(), owner_id=uuid.UUID(user.get('id')))
    todo_model.id=uuid.uuid4()

    dataBase.add(todo_model)
    dataBase.commit()
    dataBase.refresh(todo_model)

    if todo_model.deadline:
        reminder_time = todo_model.deadline
        schedule_email(user.get('email'), "Task Reminder", f"Reminder: Your task '{todo_model.title}' is due in 24 hour!", reminder_time)

    return todo_model


# Define a PUT endpoint to update a task by its ID
# Put with database
@router.put("/{todo_id}")
async def update_todo(user:user_dependency, dataBase:dataBase_dependency,todo_id: uuid.UUID, task_payload: AddTasksPayload):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")

    todo_model = dataBase.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id == uuid.UUID(user.get('id'))).first()
    if todo_model is None:
        # Raise an exception if the task is not found
        raise HTTPException(status_code=404, detail="Task not found")  
    
    todo_model.title = task_payload.title
    todo_model.body = task_payload.body
    todo_model.color = task_payload.color
    todo_model.status = task_payload.status
    todo_model.deadline = task_payload.deadline
    todo_model.remainder = task_payload.remainder
    
    dataBase.add(todo_model)
    dataBase.commit()
    dataBase.refresh(todo_model)

    # Remove existing email job if needed
    scheduler.remove_all_jobs()

    if todo_model.deadline is not None:
        if todo_model.deadline.tzinfo is None:
            todo_model.deadline = ISRAEL_TZ.localize(todo_model.deadline)

    # Get current time in UTC
    now = datetime.now(ISRAEL_TZ)

    # Calculate reminder time to be one day before the deadline
    reminder_time = todo_model.deadline - timedelta(days=1) + timedelta(minutes=1)

    # Calculate the time difference from now to the reminder time
    time_difference = reminder_time - now

    # Schedule the email if the reminder time is in the future
    # if time_difference.total_seconds() > 10 :
    if time_difference.total_seconds() > 10 and todo_model.remainder == True :
    
        schedule_email(user.get('email'), "Task Reminder", f"Reminder: Your task '{todo_model.title}' is due in 24 hour!", reminder_time)
    else:
        print("The reminder time is in the past or the user dont want a remainder; email will not be scheduled.")

    return todo_model


# Define a DELETE endpoint to delete a task by its ID
# Delete with database
@router.delete("/{todo_id}")
async def delete_todo(user:user_dependency, dataBase:dataBase_dependency, todo_id: uuid.UUID):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")

    todo_model = dataBase.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id == uuid.UUID(user.get('id'))).first()
    if todo_model is None:
        # Raise an exception if the task is not found
        raise HTTPException(status_code=404, detail="Task not found")
    dataBase.query(Todos).filter(Todos.id == todo_id).filter(Todos.id == todo_id).filter(Todos.owner_id == uuid.UUID(user.get('id'))).delete()
    dataBase.commit()


@router.post("/send-test-email")
async def send_test_email(email: str, background_tasks: BackgroundTasks):
    subject = "Test Email"
    body = "This is a test email to verify email sending functionality."
    background_tasks.add_task(send_email, email, subject, body)
    return {"message": "Test email sent"}