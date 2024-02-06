# Import necessary modules and classes from FastAPI and Python
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse  # Import JSONResponse here
from typing import List
import sqlite3
from models import Tasks, AddTasksPayload
import uuid

# Connect to the SQLite database named 'users.db'
conn = sqlite3.connect('users.db')

# Create a FastAPI application
app = FastAPI()

# Initialize an empty list to store tasks temporarily
tasks = []

# Define allowed origins for CORS (Cross-Origin Resource Sharing)
origins = ["http://localhost:3000"]
# Enable CORS using CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a POST endpoint for creating tasks
@app.post("/todo")
async def create_todos(task_description: AddTasksPayload):
    # Add the received task to the temporary list (simulating database insertion)
    task = Tasks(id=uuid.uuid4(), description= task_description.description)
    tasks.append(task)
    return task

# Define a GET endpoint to retrieve all tasks
# get without database
@app.get("/todos")
async def get_all_todos():
    # Return the temporary list of tasks (simulating database retrieval)
    return tasks



# Define a GET endpoint to retrieve a task by its ID
# get by id without database
@app.get("/todo/{task_id}")
async def get_todo_by_id(task_id: uuid.UUID):
    # Retrieve a specific task from the temporary list by ID
    for task in tasks:
        if task.id == task_id:
            return task    
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")



# Define a PUT endpoint to update a task by its ID
@app.put("/todo/{task_id}")
async def update_todo(task_id: uuid.UUID, task_obj: Tasks):
    # Logic to update a task with the specified ID (placeholder for future implementation)
    for task in tasks:
        if task.id == task_id:
            task.id = task_id
            task.description = task_obj.description
            return task
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")

# Define a DELETE endpoint to delete a task by its ID
@app.delete("/todo/{task_id}")
async def delete_todo(task_id: uuid.UUID):
    # Logic to delete a task with the specified ID (placeholder for future implementation)
    for task in tasks:
        if task.id == task_id:
            tasks.remove(task)
            return{"message": "Task has been deleted"}
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")