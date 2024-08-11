from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends,status
from sqlalchemy.orm import Session
from models import Company
from database import SessionLocal
from typing import Annotated

router = APIRouter(
    prefix='/companies',
    tags=['companies']
)

def get_dataBase():
    dataBase = SessionLocal()
    try:
        yield dataBase
    finally:
        dataBase.close()

dataBase_dependency = Annotated[Session, Depends(get_dataBase)]

class CompanyCreate(BaseModel):
    name: str

@router.post("/register/")
def register_company(company: CompanyCreate, db: dataBase_dependency):
    existing_company = db.query(Company).filter(Company.name == company.name).first()
    if existing_company:
        raise HTTPException(status_code=400, detail="Company already exists")

    new_company = Company(name=company.name)
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return {"message": "Company registered successfully", "company": new_company}

@router.get("/{company_id}")
def get_company(company_id: int, db: dataBase_dependency):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.get("/")
def list_companies(db: dataBase_dependency):
    companies = db.query(Company).all()
    return {"companies": companies}

@router.delete("/{company_id}")
async def delete_user(company_id: int, dataBase: dataBase_dependency):
    company = dataBase.query(Company).filter(Company.id == company_id).first()
    if company is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    
    dataBase.delete(company)
    dataBase.commit()
    return {"detail": "Company deleted successfully"}
