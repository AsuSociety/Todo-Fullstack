# Import necessary modules and classes from FastAPI and Python
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse  # Import JSONResponse here
from typing import List
import sqlite3
from models import Tasks

# Connect to the SQLite database named 'users.db'
conn = sqlite3.connect('users.db')

# Create a FastAPI application
app = FastAPI()
next_id = 1  # Initial value for the next ID

@app.get("/generate_id")
def generate_id():
    global next_id
    generated_id = next_id
    next_id += 1
    return JSONResponse(content={"id": generated_id})

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
@app.post("/todos")
async def create_todos(task: Tasks):
    # Add the received task to the temporary list (simulating database insertion)
    tasks.append(task)
    print(f"==========POST=========")
    return task

# Define a GET endpoint to retrieve all tasks
# get without database
@app.get("/")
async def get_all_todos():
    # Return the temporary list of tasks (simulating database retrieval)
    print(f"==========={tasks}=========")
    return tasks

# get with database
# @app.get("/")
# async def get_all_todos():
#     # Retrieve all tasks from the database (use your own logic here)
#     tasks = get_all_tasks()
#     print(f"==========={tasks}=========")
#     return tasks


# Define a GET endpoint to retrieve a task by its ID
# get by id without database
@app.get("/{task_id}")
async def get_todo_by_id(task_id: int):
    # Retrieve a specific task from the temporary list by ID
    for task in tasks:
        if task.id == task_id:
            return task    
    # Raise an exception if the task is not found
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

# get by id with database
# @app.get("/{task_id}", response_model=Tasks)
# async def get_todo_by_id(task_id: int):
#     # Retrieve a specific task from the temporary list by ID
#     task = get_task_by_id(task_id)
    
#     # Raise an exception if the task is not found
#     if task is None:
#         raise HTTPException(status_code=404, detail="Task not found")
#     return task


# Function to retrieve all tasks from the 'todos' table in the SQLite database
def get_all_tasks():
    with conn:
        c = conn.cursor()
        c.execute("SELECT * FROM todos")
        tasks = c.fetchall()
        print(f"==========={tasks}=========")
    return tasks

# Function to retrieve a task by its ID from the 'todos' table in the SQLite database
def get_task_by_id(task_id: int):
    with conn:
        c = conn.cursor()
        c.execute("SELECT * FROM todos WHERE id = ?", (task_id,))
        task = c.fetchone()
        print(f"==========={task}=========")
    return task

# Define a PUT endpoint to update a task by its ID
@app.put("/{task_id}")
async def update_todo(task_id: int, task_obj: Tasks):
    # Logic to update a task with the specified ID (placeholder for future implementation)
    for task in tasks:
        if task.id == task_id:
            task.id = task_id
            task.description = task_obj.description
            return task
    return {"message": "No task found to update"}


# Define a DELETE endpoint to delete a task by its ID
@app.delete("/{task_id}")
async def delete_todo(task_id: int):
    global next_id
    # Logic to delete a task with the specified ID (placeholder for future implementation)
    for task in tasks:
        if task.id == task_id:
            tasks.remove(task)
            if task_id == next_id - 1:
                next_id -=1

            return{"message": "Task has been deleted"}
    return {"message": "No task found"}
