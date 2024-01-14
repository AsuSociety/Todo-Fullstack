from typing import Union

from fastapi import FastAPI

from models import Tasks

from users import User

import sqlite3

conn = sqlite3.connect('users.db')

c= conn.cursor()
# c.execute("""CREATE TABLE users(
#             name text,
#             password text
#             )""")

# c.execute("INSERT INTO users VALUES ('Omer', '123456')")

def insert_user(user):
    with conn:
        c.execute("INSERT INTO users VALUES (?,?)",(user.name,user.password))

def get_user_by_name(name):
    c.execute("SELECT * FROM users WHERE name =:name")
    return c.fetchall()

def update_password(user, password):
    with conn:
        c.execute("""UPDATE users SET password = :password
                    WHERE name = :name""",
                  {'name': user.name, 'password': password})


def remove_user(user):
    with conn:
        c.execute("DELETE from users WHERE name = :name",
                  {'name': user.name})



user_1 = User('alon', '987654')
user_2= User('David', 'alonhomo')
user_3= User('Bar', 'USA')

insert_user(user_2)
insert_user(user_3)

update_password(user_2, 'alonSharmota')
remove_user(user_1)

# users = get_user_by_name('David')
# print(users)

conn.close()

app = FastAPI()


todos = []

@app.get("/")
async def get_todos():
    return {"todos": todos}

@app.get("/{task_id}")
async def get_todo(task_id:int):
    for task in todos:
        if task.id == task_id:
            return{"task": task}
    return {"message": "No task found"}

@app.post("/")
async def create_todos(task: Tasks):
    todos.append(task)
    return {"message": "task has been added"}


@app.put("/{task_id}")
async def update_todo(task_id:int, task_obj: Tasks):
    for task in todos:
        if task.id == task_id:
            task.id = task_id
            task.description = task_obj.description
            return{"task": task}
    return {"message": "No task found to update"}


@app.delete("/{task_id}")
async def delete_todo(task_id:int):
    for task in todos:
        if task.id == task_id:
            todos.remove(task)
            return{"message": "Task has been deleted"}
    return {"message": "No task found"}
