#auth.py
from datetime import datetime, timedelta
from typing import Annotated, Union
from fastapi import APIRouter, Depends, HTTPException, status
from database import SessionLocal
from models import Token, Users,AddUsersPayload
from passlib.context import CryptContext
from database import  SessionLocal
from sqlalchemy.orm import Session
import uuid
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError

router = APIRouter(
     prefix='/auth',
     tags=['auth']
)

SECRET_KEY = '3312e37b66c625eddc702ffd92fd7b33d44a80a75350c826f14cefca4e510888'
ALGORITHM = 'HS256'

bcrypt_context= CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

def get_dataBase():
    dataBase = SessionLocal()
    try:
        yield dataBase
    finally:
        dataBase.close()

dataBase_dependency = Annotated[Session, Depends(get_dataBase)]

def authenticate_user(username: str, passowrd: str, dataBase):
    user = dataBase.query(Users).filter(Users.username== username).first()
    if not user:
        return False
    if not bcrypt_context.verify(passowrd, user.hashed_password ):
        return False
    return user

def create_access_token(username: str, user_id: Union[str, uuid.UUID],role: str, expires_delta: timedelta):
     encode = {'sub': username, 'id': str(user_id), 'role': role}
     expires = datetime.utcnow()+ expires_delta
     encode.update({'exp' : expires})
     return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str,Depends(oauth2_bearer)]):
     try:
          payload= jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
          username: str = payload.get('sub')
          user_id: uuid = payload.get('id')
          role: str= payload.get('role')

          if username is None or user_id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
          return {'username':username, 'id':user_id, 'role':role}
     except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")



@router.get("/")
async def get_user(dataBase: dataBase_dependency):
    return dataBase.query(Users).all()


@router.post("/")
async def create_user(dataBase: dataBase_dependency, 
                      user_payload: AddUsersPayload):
    user_model= Users(
        email=user_payload.email,
        username=user_payload.username,
        firstname= user_payload.firstname,
        lastname= user_payload.lastname,
        role= user_payload.role,
        hashed_password= bcrypt_context.hash(user_payload.password),
        isactive= True
    )
    user_model.id=uuid.uuid4()
    dataBase.add(user_model)
    dataBase.commit()
    return user_model


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm,Depends()],
                                     dataBase: dataBase_dependency ):
        user= authenticate_user(form_data.username,form_data.password, dataBase)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
        
        token = create_access_token(user.username, user.id, user.role, timedelta(minutes=20))
        return {'access_token': token, 'type_of_token': 'bearer'}


@router.delete("/{user_id}")
async def delete_user(user_id: uuid.UUID, dataBase: dataBase_dependency):
    user = dataBase.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    dataBase.delete(user)
    dataBase.commit()
    return {"detail": "User deleted successfully"}