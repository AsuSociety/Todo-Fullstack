from fastapi import FastAPI
from pydantic import BaseModel, UUID4
import uuid

class Task(BaseModel):
    id: uuid.UUID
    # description: str
    title: str
    body: str


class DB(BaseModel):
    tasks: dict[str,Task]

class AddTasksPayload(BaseModel):
    # description: str
    title: str
    body: str

    
# class Users(BaseModel):
#     name: str
#     password: str
