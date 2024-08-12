# main.py
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
from routers import auth, todos, admin, user, company
from dotenv import load_dotenv

import os 
load_dotenv()

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(user.router)
app.include_router(company.router)


if os.getenv("NODE_ENV")== 'production':
    app.mount("/", StaticFiles(directory="public", html=True), name="public")

else:

    origins = ["http://localhost:5173"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

