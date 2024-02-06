# Import necessary modules and classes from FastAPI and Python
from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse  # Import JSONResponse here
from typing import List
import sqlite3
from models import Task, AddTasksPayload, DB
import uuid
import json
from tasksEncoder import TasksEncoder
from pathlib import Path



# Connect to the SQLite database named 'users.db'
conn = sqlite3.connect('users.db')

# Create a FastAPI application
app = FastAPI()

# Initialize an empty list to store tasks temporarily
# tasks = {}
# File path for storing todos
# file_path = "todos.json"
# p=Path(file_path)
# # db=  DB(tasks={})
# db=DB.parse_raw(p.read_text())
file_path = Path("/Users/asus/Developer/todo fullstuck/back/todos.json")
p=Path(file_path)
if file_path.exists():
    db=DB.parse_raw(p.read_text())
    db.tasks = {uuid.UUID(key): value for key, value in db.tasks.items()}

else:
    print(f"Error: File not found - {file_path}")
# print(f"bla**{db}**bla")


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



@app.on_event("shutdown")
def save_todos_on_shutdown():
    # Save todos to file when the server shuts down
    # db = tasks.copy()
    # print(f"####{db}####")
    # p.write_text(db.json())
    db_str_keys = {str(key): value for key, value in db.tasks.items()}
    p.write_text(DB(tasks=db_str_keys).json())




# Define a POST endpoint for creating tasks
@app.post("/todo")
async def create_todos(task_description: AddTasksPayload):
    # Add the received task to the temporary list (simulating database insertion)
    task_id = uuid.uuid4()
    db.tasks[task_id] = {"id": task_id, "description": task_description.description}
    # db = tasks.copy()
    print(f"**foooo**{db}****")

    return db.tasks[task_id]

# Define a GET endpoint to retrieve all tasks
# get without database
@app.get("/todos")
async def get_all_todos():
    # Return the temporary list of tasks (simulating database retrieval)
    bla=db.tasks.values()
    # print(f"fooooo**{bla}**fooooo")
    return list(db.tasks.values())



# Define a GET endpoint to retrieve a task by its ID
# get by id without database
@app.get("/todo/{task_id}")
async def get_todo_by_id(task_id: uuid.UUID):
    # Retrieve a specific task from the dictionary by ID
    task = db.tasks.get(task_id)
    if task:
        return task
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")




# Define a PUT endpoint to update a task by its ID
@app.put("/todo/{task_id}")
async def update_todo(task_id: uuid.UUID, task_obj: Task):
    # Logic to update a task with the specified ID in the dictionary (placeholder for future implementation)
    task = db.tasks.get(task_id)
    if task:
        task.description = task_obj.description
        # db = db.copy()
        print(f"$$$${db}$$$$")

        return task
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")


# Define a DELETE endpoint to delete a task by its ID
@app.delete("/todo/{task_id}")
async def delete_todo(task_id: uuid.UUID):
    # Logic to delete a task with the specified ID from the dictionary (placeholder for future implementation)
    print(f"======================")
    print(f"******{task_id}******")
    print(f"^^^^^^{db}^^^^^^")
    task = db.tasks.pop(task_id, None)
    print(f"bol- {task} -bol")
    if task:
        # db = tasks.copy()
        print(f"==========={task}===========")

        return {"message": "Task has been deleted"}
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")
