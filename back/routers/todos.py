#todos.py
from fastapi import APIRouter, Depends, File, UploadFile
from fastapi import HTTPException, status, Request
from typing import Annotated, List, Dict
from models import  AddTasksPayload,GetTaskResponse, Todos, Users,Photo, Company, TaskVisibility
import uuid
from pathlib import Path
from fastapi_mail import FastMail, MessageSchema, MessageType
import asyncio
from .auth import get_current_user
from database import  SessionLocal
from sqlalchemy.orm import Session
from fastapi import BackgroundTasks
from datetime import timedelta, datetime
from config import conf
import os
import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
import logging
from apscheduler.events import EVENT_JOB_EXECUTED


from starlette.datastructures import URL
from pytz import timezone

ISRAEL_TZ = timezone('Asia/Jerusalem')
logging.basicConfig(level=logging.DEBUG)


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


def transform_todo_to_response(todo, base_url: URL):
    photo_urls = [photo.photo_url for photo in todo.photos]
    photo_ids = [photo.id for photo in todo.photos]

    return {
        'id': todo.id,
        'owner_id': todo.owner_id,
        'assignee_id': todo.assignee_id,
        'body': todo.body,
        'title': todo.title,
        'color': todo.color,
        'status': todo.status,
        'deadline': todo.deadline,
        'remainder': todo.remainder,
        'photo_urls': photo_urls,
        'photo_ids': photo_ids,
        'visibility':todo.visibility
    }


# Define a GET endpoint to retrieve all tasks from the same user
# get with database
@router.get("/")
async def get_todos_from_db(user: user_dependency, request: Request, dataBase: dataBase_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")

    user_id = uuid.UUID(user.get('id'))
    user_company_name = user.get('company_name')
    todos_query = dataBase.query(Todos).join(Users, Todos.owner_id == Users.id).filter(
        ((Todos.visibility == TaskVisibility.COMPANY) & (Users.company_name == user_company_name)) |
        ((Todos.visibility == TaskVisibility.PRIVATE) & (Todos.owner_id == user_id))
    )
    todos = todos_query.all()

    base_url = request.base_url
    todo_list = [transform_todo_to_response(todo, base_url) for todo in todos]

    return todo_list


# Define a GET endpoint to retrieve task by ID
# get with database
@router.get("/{todo_id}")
async def get_todos_from_db_by_id(user:user_dependency, dataBase:dataBase_dependency,request: Request, todo_id: uuid.UUID ):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")

    todo_model = dataBase.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id == uuid.UUID(user.get('id'))).first()
    if todo_model is not None:
        base_url = request.base_url
        return transform_todo_to_response(todo_model, base_url)
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
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

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
async def create_todo(user: user_dependency, dataBase:dataBase_dependency,task_payload: AddTasksPayload,request: Request, background_tasks: BackgroundTasks):
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

    base_url = request.base_url
    return transform_todo_to_response(todo_model, base_url)

# Define a PUT endpoint to update a task by its ID
# Put with database
@router.put("/{todo_id}")
async def update_todo(
    user: user_dependency,
    dataBase: dataBase_dependency,
    todo_id: uuid.UUID,
    request: Request,
    task_payload: AddTasksPayload
):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't validate the user")

    user_id = uuid.UUID(user.get('id'))
    user_company_name = user.get('company_name')

    todo_model = (
        dataBase.query(Todos)
        .join(Users, Todos.owner_id == Users.id)
        .filter(Todos.id == todo_id)
        .first()
    )
    if todo_model is None:
        raise HTTPException(status_code=404, detail="Task not found")

    related_user = (
        dataBase.query(Users)
        .filter(Users.id == todo_model.owner_id)
        .first()
    )

    if related_user is None:
        raise HTTPException(status_code=404, detail="Related user not found")

    if not (
        todo_model.owner_id == user_id or
        (todo_model.visibility == TaskVisibility.COMPANY and related_user.company_name == user_company_name)
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to update this task")

    todo_model.title = task_payload.title
    todo_model.body = task_payload.body
    todo_model.color = task_payload.color
    todo_model.status = task_payload.status
    todo_model.deadline = task_payload.deadline
    todo_model.remainder = task_payload.remainder
    todo_model.visibility = task_payload.visibility
    todo_model.assignee_id = task_payload.assignee_id  


    dataBase.add(todo_model)
    dataBase.commit()
    dataBase.refresh(todo_model)
    scheduler.remove_all_jobs()

    assignee = None  
    assignee_email= None

    if task_payload.assignee_id is not None:
        assignee = (
            dataBase.query(Users)
            .filter(Users.id == task_payload.assignee_id)
            .first()
        )
    else:
        print("No assignee ID provided.")

    if assignee:
        assignee_email = assignee.email 
        print("The Assignee mail is:", assignee_email)
    else:
        print("No assignee provided.")


    if todo_model.deadline is not None:
        if todo_model.deadline.tzinfo is None:
            todo_model.deadline = ISRAEL_TZ.localize(todo_model.deadline)

        now = datetime.now(ISRAEL_TZ)
        real_deadline= todo_model.deadline -timedelta(hours=3)
        reminder_time = real_deadline - timedelta(days=1) + timedelta(minutes=1)
        time_difference = reminder_time - now


        if time_difference.total_seconds() > 10 and todo_model.remainder == True:
            schedule_email(user.get('email'), "Task Reminder", f"Reminder: Your task '{todo_model.title}' is due in 24 hours!", reminder_time)
            if assignee_email:
                schedule_email(assignee_email,  "Task Reminder", f"Reminder: Your task '{todo_model.title}' is due in 24 hours!", reminder_time)

        else:
            print("The reminder time is in the past or the user doesn't want a reminder; email will not be scheduled.")

    else:
        print("Deadline is not set; skipping reminder scheduling.")
        
    base_url = request.base_url
    return transform_todo_to_response(todo_model, base_url)

# Define a DELETE endpoint to delete a task by its ID
# Delete with database
@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: uuid.UUID,
    user: user_dependency,
    dataBase: dataBase_dependency,
):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user"
        )
    
    todo = dataBase.query(Todos).filter(
        Todos.id == todo_id,
        Todos.owner_id == uuid.UUID(user.get('id'))
    ).first()

    if todo is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for photo in todo.photos:
        try:
            photo_path = Path(photo.photo_url) 
            if photo_path.exists():
                os.remove(photo_path)
            dataBase.delete(photo)
        except Exception as e:
            print(f"Failed to delete photo with ID {photo.id}: {e}")

    dataBase.delete(todo)
    dataBase.commit()

    return {"detail": "Task deleted successfully"}


@router.post("/send-test-email")
async def send_test_email(email: str, background_tasks: BackgroundTasks):
    subject = "Test Email"
    body = "This is a test email to verify email sending functionality."
    background_tasks.add_task(send_email, email, subject, body)
    return {"message": "Test email sent"}


UPLOAD_DIRECTORY = "uploads/"
Path(UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)


# Define a POST endpoint for file upload
@router.post("/upload/{todo_id}")
async def upload_file(todo_id: uuid.UUID, user: user_dependency, dataBase: dataBase_dependency,request: Request, files: list[UploadFile] = File(...)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't Validate the user")

    todo_model = dataBase.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id == uuid.UUID(user.get('id'))).first()
    if not todo_model:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    file_urls = []
    for file in files:
        file_location = os.path.join(UPLOAD_DIRECTORY, f"{uuid.uuid4()}_{file.filename}")
        with open(file_location, "wb") as f:
            f.write(await file.read())
                
        photo_url = f"{request.base_url}uploads/{os.path.basename(file_location)}"
        photo = Photo(todo_id=todo_id, photo_path=file_location, photo_url=photo_url)
        dataBase.add(photo)
        file_urls.append(photo_url)

    dataBase.commit()
    todo_model = dataBase.query(Todos).filter(Todos.id == todo_id).first()
    base_url = request.base_url
    return transform_todo_to_response(todo_model, base_url)


# Define a DELETE endpoint to remove a photo by its ID
@router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: int, user: user_dependency, dataBase: dataBase_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't Validate the user")

    photo = dataBase.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Photo not found")

    todo = dataBase.query(Todos).filter(Todos.id == photo.todo_id).filter(Todos.owner_id == uuid.UUID(user.get('id'))).first()
    if todo is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to delete this photo")

    dataBase.delete(photo)
    dataBase.commit()

    if os.path.exists(photo.photo_path):
        os.remove(photo.photo_path)

    return {"message": "Photo deleted successfully"}


def list_uploaded_files(directory: str):
    try:
        files = os.listdir(directory)
        return [os.path.join(directory, file) for file in files]
    except Exception as e:
        print(f"Failed to list files: {e}")
        return []


