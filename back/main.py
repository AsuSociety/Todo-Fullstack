# main.py

# Import necessary modules and classes from FastAPI and Python
from fastapi import FastAPI, Depends
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse  
from typing import Annotated, List
from typing import List
from config import conf
from fastapi.staticfiles import StaticFiles
import models
from database import engine, SessionLocal
from routers import auth, todos, admin, user


# Create a FastAPI application
app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# models.Base.metadata.drop_all(bind=engine)
# models.Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(user.router)



# Define allowed origins for CORS (Cross-Origin Resource Sharing)
origins = ["http://localhost:5173"]
# Enable CORS using CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)