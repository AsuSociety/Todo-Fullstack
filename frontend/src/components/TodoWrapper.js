// TodoWrapper.js
import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";

export const API_URL = "http://localhost:8000";

const fetchAllTodos = async () => {
  try {
    const url = `${API_URL}/todos`;
    console.log("Fetching todos from:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Response data:", data);

    return data;
  } catch (error) {
    console.error(`Error fetching todos${""}:`, error);
    return [];
  }
};

const fetchTodoByID = async (id = "") => {
  try {
    const url = `${API_URL}/todo/${id}`;
    console.log("Fetching todos from:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Response data:", data);

    return data;
  } catch (error) {
    console.error(`Error fetching todos${` with ID ${id}`}:`, error);
    return [];
  }
};

const addTodo = async (todo) => {
  try {
    const response = await fetch(`${API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo), // Assuming `todo` is already in the correct format
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add todo: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("New todo data:", data);

    return data;
  } catch (error) {
    console.error("Error adding todo:", error);
    return null;
  }
};

const deleteTodo = async (id) => {
  try {
    await fetch(`${API_URL}/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return id;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return null;
  }
};

const editTask = async (task, id) => {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, title: task.title, body: task.body }), // Include both body and title properties
    });

    const updatedTodo = await response.json();

    return updatedTodo;
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);
  // Use useEffect to fetch todos when the component mounts
  // useEffect(() => {
  //   fetchAllTodos();
  //   setTodos(fetchAllTodos());
  //   // fetchTodoByID();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTodos = await fetchAllTodos();
        setTodos(fetchedTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddTodo = async (todo) => {
    const newTodo = await addTodo(todo);
    // console.log("foooo", todos);

    if (newTodo) {
      // Update the state with the new todo
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    }
  };
  const handleDeleteTodo = async (id) => {
    const deletedId = await deleteTodo(id);
    console.log("foooo", id);

    if (deletedId) {
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== deletedId)
      );
    }
  };

  const handleEditTask = async (task, id) => {
    console.log("foooo1", task);
    const updatedTask = await editTask(task, id);
    console.log("foooo", task);

    if (updatedTask) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTask : todo))
      );
    }
    console.log("blalalal", todos);
  };

  const markForEdit = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  return (
    <div className="TodoWrapper">
      <h1>My To-Do List!</h1>

      <TodoForm handleAddTodo={handleAddTodo} />

      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm
            editTodo={(task) => handleEditTask(task, todo.id)}
            task={todo}
          />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={handleDeleteTodo}
            editTodo={markForEdit}
          />
        )
      )}
    </div>
  );
};
