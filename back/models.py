# models.py
from datetime import datetime
from typing import List, Optional
from database import Base
from fastapi import FastAPI
from pydantic import BaseModel, UUID4, EmailStr, Field
import uuid
from sqlalchemy import Boolean, Column,  String, ForeignKey, DateTime, UUID as PG_UUID

class Users(Base):
    __tablename__= 'users'

    id= Column(PG_UUID(as_uuid=True), primary_key=True,default=uuid.uuid4, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    firstname = Column(String)
    lastname= Column(String)
    hashed_password = Column(String)
    isactive = Column(Boolean, default=True)
    role= Column(String)
    icon= Column(String)


# Add Priority 
class Todos(Base):
    __tablename__= 'todos'

    id= Column(PG_UUID(as_uuid=True), primary_key=True,default=uuid.uuid4, index=True)
    title = Column(String)
    body = Column(String)
    color = Column(String)
    status= Column(String)
    deadline = Column(DateTime, nullable=True)  
    owner_id= Column(PG_UUID(as_uuid=True),ForeignKey("users.id"))



class AddTasksPayload(BaseModel):
    title: str
    body: str
    color: str = None
    status: str
    deadline: Optional[datetime] = None  



class AddUsersPayload(BaseModel):
    email: str = Field(min_length=8)
    username: str = Field(min_length=3)
    password: str = Field(min_length=5)
    firstname: str= Field(min_length=2)
    lastname: str = Field(min_length=2)
    role: str = Field(min_length=3)
    icon : str

class UpdateIconPayload(BaseModel):
    icon: str

class Token(BaseModel):
    access_token: str
    type_of_token: str

class UserVerification(BaseModel):
    password: str
    new_password: str

# class EmailSchema(BaseModel):
#     email: List[EmailStr]

# class EmailContent(BaseModel):
#     message : str
#     subject : str