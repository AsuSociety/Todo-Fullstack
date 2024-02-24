// TodoWrapper.js

/*
This code sets up a web application where you can manage your to-do list. 
It allows you to add new tasks, delete completed tasks, and edit existing tasks. 
The application communicates with a server to fetch, add, delete, and update tasks. 
It presents your to-do list in a user-friendly format on the screen. 
Overall, it provides a convenient way for you to organize and keep track of your tasks online.
*/

// Import necessary modules and components
import React, { useState, useEffect } from "react"; // Import React and necessary hooks
import { Todo } from "./Todo"; // Import Todo component
import { TodoForm } from "./TodoForm"; // Import TodoForm component for adding todos
import { EditTodoForm } from "./EditTodoForm"; // Import EditTodoForm component for editing todos

// Define API_URL constant for API endpoint
export const API_URL = "http://localhost:8000";

// Function to fetch all todos from the API
const fetchAllTodos = async () => {
  try {
    const url = `${API_URL}/todos`; // Construct API URL
    console.log("Fetching todos from:", url); // Log fetching todos URL

    const response = await fetch(url); // Fetch todos from API
    console.log("Response status:", response.status); // Log response status

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json(); // Parse response data
    console.log("Response data:", data); // Log response data

    return data; // Return fetched todos data
  } catch (error) {
    console.error(`Error fetching todos${""}:`, error); // Log error if fetching todos fails
    return []; // Return empty array if fetching todos fails
  }
};

// Function to add a new todo
const addTodo = async (todo) => {
  try {
    const response = await fetch(`${API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo), // Convert todo object to JSON string
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add todo: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json(); // Parse response data
    console.log("New todo data:", data); // Log new todo data

    return data; // Return new todo data
  } catch (error) {
    console.error("Error adding todo:", error); // Log error if adding todo fails
    return null; // Return null if adding todo fails
  }
};

// Function to delete a todo by ID
const deleteTodo = async (id) => {
  try {
    await fetch(`${API_URL}/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return id; // Return deleted todo ID
  } catch (error) {
    console.error("Error deleting todo:", error); // Log error if deleting todo fails
    return null; // Return null if deleting todo fails
  }
};

// Function to edit a todo
const editTask = async (task, id) => {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, title: task.title, body: task.body }), // Include both body and title properties
    });

    const updatedTodo = await response.json(); // Parse response data

    return updatedTodo; // Return updated todo
  } catch (error) {
    console.error("Error updating task:", error); // Log error if updating task fails
    return null; // Return null if updating task fails
  }
};

// TodoWrapper functional component
export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]); // State hook to store todos

  // useEffect hook to fetch todos when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTodos = await fetchAllTodos(); // Fetch all todos
        setTodos(fetchedTodos); // Set todos state with fetched todos
      } catch (error) {
        console.error("Error fetching todos:", error); // Log error if fetching todos fails
      }
    };

    fetchData(); // Call fetchData function
  }, []); // Empty dependency array to run effect only once

  // Function to handle adding a new todo
  const handleAddTodo = async (todo) => {
    const newTodo = await addTodo(todo); // Add new todo
    if (newTodo) {
      setTodos((prevTodos) => [...prevTodos, newTodo]); // Update todos state with new todo
    }
  };

  // Function to handle deleting a todo
  const handleDeleteTodo = async (id) => {
    const deletedId = await deleteTodo(id); // Delete todo by ID
    if (deletedId) {
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== deletedId)
      ); // Update todos state by removing deleted todo
    }
  };

  // Function to handle editing a todo
  const handleEditTask = async (task, id) => {
    const updatedTask = await editTask(task, id); // Edit todo
    if (updatedTask) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTask : todo))
      ); // Update todos state with updated todo
    }
  };

  // Function to mark a todo for editing
  const markForEdit = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    ); // Toggle isEditing property of todo
  };

  // JSX structure returned by the TodoWrapper component
  return (
    <div className="TodoWrapper">
      <h1>My To-Do List!</h1>
      <TodoForm handleAddTodo={handleAddTodo} />{" "}
      {/* Render TodoForm component for adding todos */}
      {/* Map through todos array and render Todo or EditTodoForm component for each todo */}
      {todos.map((todo) =>
        todo.isEditing ? ( // Check if todo is being edited
          <EditTodoForm // Render EditTodoForm component for editing todo
            // key={todo.id}
            editTodo={(task) => handleEditTask(task, todo.id)} // Pass editTodo function as prop
            task={todo} // Pass todo as prop
          />
        ) : (
          <Todo // Render Todo component for displaying todo
            key={todo.id}
            task={todo} // Pass todo as prop
            deleteTodo={handleDeleteTodo} // Pass deleteTodo function as prop
            editTodo={markForEdit} // Pass markForEdit function as prop
            setTodos={setTodos}
          />
        )
      )}
    </div>
  );
};
