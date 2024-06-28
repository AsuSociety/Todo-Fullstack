# main.py

# Import necessary modules and classes from FastAPI and Python
from fastapi import FastAPI, Depends
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse  # Import JSONResponse here
from typing import Annotated, List
import sqlite3


import models
from database import engine, SessionLocal
from routers import auth, todos, admin, user


# Connect to the SQLite database named 'users.db'
conn = sqlite3.connect('users.db')

# Create a FastAPI application
app = FastAPI()

# models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(user.router)




'''
file_path = Path("/Users/asus/Developer/todo fullstuck/back/todos.json")
p=Path(file_path)
if file_path.exists():
    db=DB.parse_raw(p.read_text())
    db.tasks = {uuid.UUID(key): value for key, value in db.tasks.items()}

else:
    print(f"Error: File not found - {file_path}")
# print(f"bla**{db}**bla")
'''

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

'''
@app.on_event("shutdown")
def save_todos_on_shutdown():
    # Save todos to file when the server shuts down
    # db = tasks.copy()
    # print(f"####{db}####")
    # p.write_text(db.json())
    db_str_keys = {str(key): value for key, value in db.tasks.items()}
    p.write_text(DB(tasks=db_str_keys).json())
'''


'''
# Define a POST endpoint for creating tasks without DB
@app.post("/todo")
async def create_todos(task_payload: AddTasksPayload):
    # Add the received task to the temporary list (simulating database insertion)
    task_id = uuid.uuid4()
    # Extract title and body from the payload
    # print(f"**foooo**{task_payload}****")
    title = task_payload.title
    body = task_payload.body
    color = task_payload.color
    # Add the received task to the database
    db.tasks[task_id] = {"id": task_id, "title": title, "body": body, "color": color}
    return db.tasks[task_id]
''' 


'''
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

'''


'''
# Define a PUT endpoint to update a task by its ID
@app.put("/todo/{task_id}")
async def update_todo(task_id: uuid.UUID, task_obj: Task):
    # Logic to update a task with the specified ID in the dictionary or as an instance of Task
    task = db.tasks.get(task_id)
    if task:
        if isinstance(task, dict):
            # If task is a dictionary, update its values directly
            db.tasks[task_id].update({"title": task_obj.title, "body": task_obj.body, "color": task_obj.color})
        else:
            # If task is an instance of Task, update its attributes
            task.title = task_obj.title
            task.body = task_obj.body
            task.color = task_obj.color
            
        return db.tasks[task_id]  # Return the updated task
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")
'''

'''
# Define a DELETE endpoint to delete a task by its ID
@app.delete("/todo/{task_id}")
async def delete_todo(task_id: uuid.UUID):
    # Logic to delete a task with the specified ID from the dictionary (placeholder for future implementation)
    # print(f"======================")
    # print(f"******{task_id}******")
    # print(f"^^^^^^{db}^^^^^^")
    task = db.tasks.pop(task_id, None)
    # print(f"bol- {task} -bol")
    if task:
        # db = tasks.copy()
        print(f"==========={task}===========")

        return {"message": "Task has been deleted"}
    # Raise an exception if the task is not found
    raise HTTPException(status_code=404, detail="Task not found")
'''