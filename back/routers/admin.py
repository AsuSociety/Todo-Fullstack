#admin.py
from fastapi import APIRouter, Depends
from fastapi import HTTPException, status
from typing import Annotated, List, Union

from jose import jwt, JWTError
from models import  UpdateCompanyName, UpdateUserRolePayload, Users, GetUserResponse
import uuid

from .auth import get_current_user, oauth2_bearer , SECRET_KEY, ALGORITHM
from database import  SessionLocal
from sqlalchemy.orm import Session



# Create a APIRouter application
router = APIRouter(
    prefix='/admin',
    tags=['admin'])

def get_dataBase():
    dataBase = SessionLocal()
    try:
        yield dataBase
    finally:
        dataBase.close()

dataBase_dependency = Annotated[Session, Depends(get_dataBase)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/company/users")
async def get_company_users(
    current_user: user_dependency,
    dataBase: dataBase_dependency
):
    if current_user['role'] != 'admin' and current_user['role'] != 'CEO':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform this action")
    
    company_name = current_user['company_name']
    users = dataBase.query(Users).filter(Users.company_name == company_name).all()
    
    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No users found for the company")

    return users

@router.put("/mail/{user_mail}/company")
async def update_user_company_by_mail(
    user_mail: str, 
    user_payload: UpdateCompanyName, 
    dataBase: dataBase_dependency, 
    token: str = Depends(oauth2_bearer)
):
    try:
        
        user = dataBase.query(Users).filter(Users.email == user_mail).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        user.company_name = user_payload.company_name
        dataBase.commit()
        user_response = GetUserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            firstname=user.firstname,
            lastname=user.lastname,
            company_name=user.company_name,
            role=user.role
        )

        return user_response


    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't validate the user")

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email format")
    


@router.delete("/company/{user_id}")
async def remove_user_from_company(
    user_id: Union[str, uuid.UUID],
    dataBase: dataBase_dependency,
    current_user: user_dependency, 
    token: str = Depends(oauth2_bearer)
):
    if current_user['role'] != 'admin' and current_user['role'] != 'CEO':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to perform this action")
    
    try:
        user_uuid = uuid.UUID(str(user_id))
        user = dataBase.query(Users).filter(Users.id == user_uuid).first()
        
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        if user.company_name != current_user['company_name']:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to remove users from other companies")
        
        # Remove the user from the company by setting the company_name to None or an appropriate placeholder
        user.company_name = ""
        dataBase.commit()
        
        return {'message': 'User removed from company successfully'}

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't validate the user")

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user_id format")


@router.put("/{user_id}/role")
async def update_user_role(
    user_id: Union[str, uuid.UUID],
    role_payload: UpdateUserRolePayload,
    dataBase: dataBase_dependency,
    token: str = Depends(oauth2_bearer)
):
    try:
        # Decode the token to get the current user details
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get('sub')
        current_role: str = payload.get('role')
        user_uuid = uuid.UUID(str(user_id))  # Ensure user_id is a UUID object

        # Ensure the user has the admin role to perform this action
        if current_role != 'admin' and current_role != 'CEO':
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to change roles")

        # Find the user in the database
        user = dataBase.query(Users).filter(Users.id == user_uuid).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Update the role
        user.role = role_payload.role
        dataBase.commit()

        user_response = GetUserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            firstname=user.firstname,
            lastname=user.lastname,
            company_name=user.company_name,
            role=user.role
        )
        return user_response
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Can't validate the user")

    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user_id format")


