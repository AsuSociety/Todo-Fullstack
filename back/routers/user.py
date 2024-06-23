# Import necessary modules and classes from FastAPI and Python
from fastapi import APIRouter, Depends
from fastapi import HTTPException, status
from typing import Annotated, List
from models import  AddUsersPayload,  Users, UserVerification
import uuid
from pathlib import Path

from .auth import get_current_user
from database import  SessionLocal
from sqlalchemy.orm import Session
from passlib.context import CryptContext


# Create a APIRouter application
router = APIRouter(
    prefix='/user',
    tags=['user'])

def get_dataBase():
    dataBase = SessionLocal()
    try:
        yield dataBase
    finally:
        dataBase.close()

dataBase_dependency = Annotated[Session, Depends(get_dataBase)]
user_dependency = Annotated[dict, Depends(get_current_user)]
bcrypt_context= CryptContext(schemes=['bcrypt'], deprecated='auto')


@router.get("/")
async def get_user(user: user_dependency, dataBase: dataBase_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
    return dataBase.query(Users).filter(Users.id ==uuid.UUID(user.get('id'))).first()



@router.put("/password")
async def update_password(user:user_dependency, dataBase:dataBase_dependency, user_verifi: UserVerification):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
    user_model = dataBase.query(Users).filter(Users.id==uuid.UUID(user.get('id'))).first()

    if not bcrypt_context.verify(user_verifi.password,user_model.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Error on password change!")
    user_model.hashed_password= bcrypt_context.hash(user_verifi.new_password)

    dataBase.add(user_model)
    dataBase.commit()
    dataBase.refresh(user_model)
    return user_model

