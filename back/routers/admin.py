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
    prefix='/admin',
    tags=['admin'])

def get_dataBase():
    dataBase = SessionLocal()
    try:
        yield dataBase
    finally:
        dataBase.close()

dataBase_dependency = Annotated[Session, Depends(get_dataBase)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.get("/todo")
async def read_all(user: user_dependency, dataBase: dataBase_dependency):
    if user is None or user.get('role')!= 'CEO':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
    return dataBase.query(Todos).all()

@router.delete("/todo/{todo_id}")
async def delete_todo(user:user_dependency, dataBase:dataBase_dependency, todo_id: uuid.UUID):
    if user is None or user.get('role')!= 'CEO':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
    
    todo_model = dataBase.query(Todos).filter(Todos.id == todo_id).first()
    if todo_model is None:
        # Raise an exception if the task is not found
        raise HTTPException(status_code=404, detail="Task not found")
    
    dataBase.query(Todos).filter(Todos.id == todo_id).filter(Todos.id == todo_id).filter(Todos.owner_id == uuid.UUID(user.get('id'))).delete()
    dataBase.commit()


