from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sqlite3
from models import Tasks, User

conn = sqlite3.connect('users.db')

app = FastAPI()

origins = [
    "http://localhost:3000",

]
# Enable CORS using CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the OAuth2PasswordBearer for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Function to get current user from token (you need to implement this)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Replace this with your authentication logic
    # This could involve decoding the token, checking the database, etc.
    return User(name="fakeuser", password="fakepassword")

# Update your 'create_todos' endpoint
@app.post("/todos")
async def create_todos(task: Tasks, current_user: User = Depends(get_current_user)):
    # Assign the username associated with the current user to the task
    task.username = current_user.name

    # Add logic to save the task to the database (use your own logic here)
    insert_task(task)

    return {"message": "Task has been added"}

# Create a new function to insert the task into the 'todos' table
def insert_task(task: Tasks):
    with conn:
        c = conn.cursor()
        c.execute("INSERT INTO todos (id, description, username) VALUES (?, ?, ?)",
                  (task.id, task.description, task.username))

# Add a new endpoint to get all tasks
@app.get("/todos", response_model=List[Tasks])
async def get_todos():
    # Retrieve tasks from the database (use your own logic here)
    tasks = get_all_tasks()
    return {"todos": tasks}

# Create a new function to get all tasks from the 'todos' table
def get_all_tasks():
    with conn:
        c = conn.cursor()
        c.execute("SELECT * FROM todos")
        tasks = c.fetchall()
    return tasks
