from fastapi import FastAPI
from pydantic import BaseModel, UUID4
import uuid


class Tasks(BaseModel):
    id: UUID4
    description: str
    # username: str  # Add this field for associating tasks with a user

class addTasksPayload(BaseModel):
    description: str

# class Users(BaseModel):
#     name: str
#     password: str
