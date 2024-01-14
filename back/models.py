from fastapi import FastAPI
from pydantic import BaseModel


class Tasks(BaseModel):
    id: int
    description: str

# class Users(BaseModel):
#     name: str
#     password: str
