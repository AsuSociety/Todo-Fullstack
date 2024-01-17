// TodoWrapper.js

import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async (id = "") => {
    try {
      const url = id
        ? `http://localhost:8000/todos/${id}`
        : "http://localhost:8000";
      console.log("Fetching todos from:", url);

      const response = await fetch(url);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch todos: ${response.status} - ${response.statusText}`
        );
      }

      const rawData = await response.text(); // Try reading the raw response text
      console.log("Raw response data:", rawData);

      const data = await response.json();
      console.log("Response data:", data);

      setTodos(Array.isArray(data) ? data : [data.todos]);
    } catch (error) {
      debugger;
      console.error(
        `Error fetching todos${id ? ` with ID ${id}` : ""}:`,
        error
      );
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todo) => {
    try {
      const response = await fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: todo, completed: false }),
      });

      const data = await response.json();
      setTodos((prevTodos) => [...prevTodos, data]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:8000/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...todoToUpdate,
          completed: !todoToUpdate.completed,
        }),
      });

      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const editTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = async (task, id) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task, completed: false }),
      });

      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>My To-Do List!</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm key={todo.id} editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
