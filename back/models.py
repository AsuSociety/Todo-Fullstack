# models.py
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI
from pydantic import BaseModel, UUID4, EmailStr, Field
import uuid
from sqlalchemy import Boolean, Column,  String, ForeignKey, DateTime, UUID as PG_UUID ,Integer, Enum as SQLAEnum
from sqlalchemy.orm import declarative_base, relationship
from enum import Enum

class TaskVisibility(Enum):
    PRIVATE = "private"
    COMPANY = "company"


Base = declarative_base()

class Company(Base):
    __tablename__ = 'companies'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    users = relationship("Users", back_populates="company")


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
    company_name = Column(String, ForeignKey('companies.name'), nullable=True)

    company = relationship("Company", back_populates="users")


class Photo(Base):
    __tablename__ = 'photos'
    id = Column(Integer, primary_key=True, index=True)
    todo_id = Column(PG_UUID(as_uuid=True),ForeignKey('todos.id'))
    photo_path = Column(String, nullable=False)
    photo_url = Column(String, nullable=False)
    todo = relationship("Todos", back_populates="photos")
    

# Add Priority 
class Todos(Base):
    __tablename__= 'todos'

    id= Column(PG_UUID(as_uuid=True), primary_key=True,default=uuid.uuid4, index=True)
    title = Column(String)
    body = Column(String)
    color = Column(String)
    status= Column(String)
    deadline = Column(DateTime, nullable=True)  
    remainder = Column(Boolean, default=True)
    owner_id= Column(PG_UUID(as_uuid=True),ForeignKey("users.id"))
    visibility = Column(SQLAEnum(TaskVisibility), default=TaskVisibility.PRIVATE)
    photos = relationship("Photo", back_populates="todo")


class AddTasksPayload(BaseModel):
    title: str
    body: str
    color: str = None
    status: str
    deadline: Optional[datetime] = None  
    remainder : bool = True
    visibility: TaskVisibility 

class GetTaskResponse(BaseModel):
    id: uuid.uuid4
    owner_id: uuid.uuid4
    title: str
    body: str
    color: str = None
    status: str
    deadline: Optional[datetime] = None  
    remainder : bool = True
    photo_urls : list[str]
    photo_ids : list[int]
    visibility: TaskVisibility = TaskVisibility.PRIVATE  

class AddUsersPayload(BaseModel):
    email: str = Field(min_length=8)
    username: str = Field(min_length=3)
    password: str = Field(min_length=5)
    firstname: str= Field(min_length=2)
    lastname: str = Field(min_length=2)
    icon : str = ""
    role: str = "user"
    company_name: str =""

class GetUserResponse(BaseModel):
    id: uuid.UUID
    email: str
    username: str
    firstname: str
    lastname: str
    company_name: str
    role: str

class UpdateIconPayload(BaseModel):
    icon: str

class UpdateCompanyName(BaseModel):
    company_name: str

class UpdateUserRolePayload(BaseModel):
    role: str 

class Token(BaseModel):
    access_token: str
    type_of_token: str

class UserVerification(BaseModel):
    password: str
    new_password: str
