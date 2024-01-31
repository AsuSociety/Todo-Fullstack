// TodoWrapper.js
// Importing necessary components and hooks from React and other files
import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";

// Defining a functional component named TodoWrapper
export const TodoWrapper = () => {
  // State to manage the list of todos
  const [todos, setTodos] = useState([]);

  // Function to fetch todos from the server
  // const fetchTodos = async (id = "") => {
  //   try {
  //     // Constructing the URL based on whether an ID is provided or not
  //     const url = id ? `http://localhost:8000/${id}` : "http://localhost:8000";
  //     console.log("Fetching todos from:", url);

  //     // Fetching data from the server
  //     const response = await fetch(url);
  //     console.log("Response status:", response.status);

  //     // Handling the response data
  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to fetch todos: ${response.status} - ${response.statusText}`
  //       );
  //     }

  //     const data = await response.json();
  //     console.log("Response data:", data);

  //     // Updating the local state with fetched data
  //     setTodos(data);
  //   } catch (error) {
  //     console.error(
  //       `Error fetching todos${id ? ` with ID ${id}` : ""}:`,
  //       error
  //     );
  //   }
  // };
  const fetchAllTodos = async () => {
    try {
      // Constructing the URL based on whether an ID is provided or not
      const url = "http://localhost:8000";
      console.log("Fetching todos from:", url);

      // Fetching data from the server
      const response = await fetch(url);
      console.log("Response status:", response.status);

      // Handling the response data
      if (!response.ok) {
        throw new Error(
          `Failed to fetch todos: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      // Updating the local state with fetched data
      setTodos(data);
    } catch (error) {
      console.error(`Error fetching todos${""}:`, error);
    }
  };
  const fetchTodosByID = async (id = "") => {
    try {
      // Constructing the URL based on whether an ID is provided or not
      const url = `http://localhost:8000/${id}`;
      console.log("Fetching todos from:", url);

      // Fetching data from the server
      const response = await fetch(url);
      console.log("Response status:", response.status);

      // Handling the response data
      if (!response.ok) {
        throw new Error(
          `Failed to fetch todos: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      // Updating the local state with fetched data
      setTodos(data);
    } catch (error) {
      console.error(`Error fetching todos${` with ID ${id}`}:`, error);
    }
  };

  // Use useEffect to fetch todos when the component mounts
  useEffect(() => {
    fetchAllTodos();
    fetchTodosByID();
  }, []);

  // Function to add a new todo
  const addTodo = async (todo) => {
    try {
      // Sending a POST request to the server with the new todo's description
      const response = await fetch("http://localhost:8000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: todo }),
      });

      // Handling the response
      if (!response.ok) {
        throw new Error(
          `Failed to add todo: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("New todo data:", data);
      console.log("Previous todos:", todos);

      // Updating the local state with the new todo
      setTodos((prevTodos) => [...prevTodos, data]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id) => {
    try {
      // Sending a DELETE request to the server with the todo's ID
      await fetch(`http://localhost:8000/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Updating the local state by removing the deleted todo
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Function to toggle the editing state of a todo
  const editTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  // Function to edit the description of a todo
  const editTask = async (task, id) => {
    try {
      // Sending a PUT request to the server with the updated task description and ID
      const response = await fetch(`http://localhost:8000/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, description: task }),
      });

      // Handling the response
      const updatedTodo = await response.json();

      // Updating the local state with the modified todo
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // JSX for rendering the component
  return (
    <div className="TodoWrapper">
      <h1>My To-Do List!</h1>

      {/* TodoForm component for adding todos */}
      <TodoForm addTodo={addTodo} />

      {/* Mapping through todos to render either EditTodoForm or Todo component */}
      {todos.map((todo) =>
        todo.isEditing ? (
          // Render EditTodoForm if todo is in editing mode
          <EditTodoForm editTodo={editTask} task={todo} />
        ) : (
          // Render Todo component otherwise
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        )
      )}
    </div>
  );
};
