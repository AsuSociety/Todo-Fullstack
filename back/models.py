from fastapi import FastAPI
from pydantic import BaseModel, UUID4
import uuid


class Tasks(BaseModel):
    id: uuid.UUID
    description: str
    # username: str  # Add this field for associating tasks with a user

class AddTasksPayload(BaseModel):
    description: str

# class Users(BaseModel):
#     name: str
#     password: str
