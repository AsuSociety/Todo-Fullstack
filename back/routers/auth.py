#auth.py
from datetime import datetime, timedelta
from typing import Annotated, Union
from fastapi import APIRouter, Depends, HTTPException, status
from database import SessionLocal
from models import Token, Users,AddUsersPayload, UpdateIconPayload, UpdateCompanyName
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

def create_access_token(username: str, user_id: Union[str, uuid.UUID],role: str, email:str ,expires_delta: timedelta):
     encode = {'sub': username, 'id': str(user_id), 'role': role, 'email':email}
     expires = datetime.utcnow()+ expires_delta
     encode.update({'exp' : expires})
     return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str,Depends(oauth2_bearer)]):
     try:
          payload= jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
          username: str = payload.get('sub')
          user_id: uuid = payload.get('id')
          role: str= payload.get('role')
          email: str=payload.get('email')

          if username is None or user_id is None:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
          return {'username':username, 'id':user_id, 'role':role, 'email':email}
     except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")



@router.get("/")
async def get_user(dataBase: dataBase_dependency):
    return dataBase.query(Users).all()

@router.get("/{username}")
async def get_user_by_username(dataBase: dataBase_dependency, username:str):
    user= dataBase.query(Users).filter(Users.username==username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.post("/")
async def create_user(dataBase: dataBase_dependency, 
                      user_payload: AddUsersPayload):
    user_model= Users(
        email=user_payload.email,
        username=user_payload.username,
        firstname= user_payload.firstname,
        lastname= user_payload.lastname,
        role= user_payload.role,
        icon = user_payload.icon,
        company_name= user_payload.company_name,
        hashed_password= bcrypt_context.hash(user_payload.password),
        isactive= True
    )
    user_model.id=uuid.uuid4()
    dataBase.add(user_model)
    dataBase.commit()
    return user_model


@router.post("/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm,Depends()],
                                     dataBase: dataBase_dependency ):
        user= authenticate_user(form_data.username,form_data.password, dataBase)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cant Validate the user")
        
        token = create_access_token(user.username, user.id, user.role,user.email, timedelta(minutes=20))
        # return {'access_token': token, 'type_of_token': 'bearer', 'username':user.username, 'email': user.email, 'first_name': user.firstname, 'last_name': user.lastname, 'role': user.role}
        response = {
        'access_token': token,
        'type_of_token': 'bearer',
        'username': user.username,
        'email': user.email,
        'first_name': user.firstname,
        'last_name': user.lastname,
        'role': user.role,
        'id': user.id,
        'icon': user.icon,
        'company_name': user.company_name,
        }
        print("Response:", response)  # Log the response
        return response

@router.delete("/{user_id}")
async def delete_user(user_id: uuid.UUID, dataBase: dataBase_dependency):
    user = dataBase.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    dataBase.delete(user)
    dataBase.commit()
    return {"detail": "User deleted successfully"}


@router.put("/{user_id}/icon")
async def update_user_icon(
    user_id: Union[str, uuid.UUID], 
    user_payload: UpdateIconPayload, 
    dataBase: dataBase_dependency, 
    token: str = Depends(oauth2_bearer)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_uuid = uuid.UUID(str(user_id))  # Ensure user_id is a UUID object
        
        user = dataBase.query(Users).filter(Users.id == user_uuid).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        user.icon = user_payload.icon
        dataBase.commit()
        
        return {'message': 'Icon updated successfully'}

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't validate the user")

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user_id format")
    


@router.put("/mail/{user_mail}/company")
async def update_user_company_by_mail(
    user_mail: str, 
    user_payload: UpdateCompanyName, 
    dataBase: dataBase_dependency, 
    token: str = Depends(oauth2_bearer)
):
    try:
        # payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # username: str = payload.get('sub')
        # user_uuid = uuid.UUID(str(user_id))  # Ensure user_id is a UUID object
        
        user = dataBase.query(Users).filter(Users.email == user_mail).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        user.company_name = user_payload.company_name
        dataBase.commit()
        
        return {'message': 'company updated successfully'}

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't validate the user")

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email format")
    

@router.put("/id/{user_id}/company")
async def update_user_company(
    user_id: Union[str, uuid.UUID], 
    user_payload: UpdateCompanyName, 
    dataBase: dataBase_dependency, 
    token: str = Depends(oauth2_bearer)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        user_uuid = uuid.UUID(str(user_id))  # Ensure user_id is a UUID object
        
        user = dataBase.query(Users).filter(Users.id == user_uuid).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        user.company_name = user_payload.company_name
        dataBase.commit()
        
        return {'message': 'company updated successfully'}

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't validate the user")

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user_id format")
    
