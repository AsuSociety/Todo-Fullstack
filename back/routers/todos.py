#todos.py
# Import necessary modules and classes from FastAPI and Python
from fastapi import APIRouter, Depends
from fastapi import HTTPException, status
from typing import Annotated, List
from models import  AddTasksPayload, Todos
import uuid
from pathlib import Path

from .auth import get_current_user
from database import  SessionLocal
from sqlalchemy.orm import Session



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


# Define a GET endpoint to retrieve all tasks
# get with database
# @router.get("/")
# async def get_todos_from_db(dataBase:dataBase_dependency ):
#     return dataBase.query(Todos).all()


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


# Define a POST endpoint for creating tasks
# Post with database
@router.post("/")
async def create_todo(user: user_dependency, dataBase:dataBase_dependency,task_payload: AddTasksPayload):
    # Extract title and body from the payload
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")

    todo_model= Todos(**task_payload.dict(), owner_id=uuid.UUID(user.get('id')))
    todo_model.id=uuid.uuid4()

    dataBase.add(todo_model)
    dataBase.commit()
    dataBase.refresh(todo_model)
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
    todo_model.color= task_payload.color
    todo_model.status = task_payload.status
    
    dataBase.add(todo_model)
    dataBase.commit()
    dataBase.refresh(todo_model)
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
