from fastapi import FastAPI
from pydantic import BaseModel


class Tasks(BaseModel):
    id: int
    description: str
    # username: str  # Add this field for associating tasks with a user

# class Users(BaseModel):
#     name: str
#     password: str
