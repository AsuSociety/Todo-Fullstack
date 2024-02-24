# models.py

from fastapi import FastAPI
from pydantic import BaseModel, UUID4
import uuid

class Task(BaseModel):
    id: uuid.UUID
    title: str
    body: str


class DB(BaseModel):
    tasks: dict[str,Task]

class AddTasksPayload(BaseModel):
    title: str
    body: str

    
# class Users(BaseModel):
#     name: str
#     password: str
