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
import { useUser } from "../UserContext";
import { AddTodo } from "./AddTodo"; // Import AddTodo component for adding todos
import { EditTodoForm } from "./EditTodoForm"; // Import EditTodoForm component for editing todos
import { useNavigate } from "react-router-dom";

// Define API_URL constant for API endpoint
export const API_URL = "http://localhost:8000";
// Define an array of colors
const colors = ["#2f8f8f", "#1d9c9c", "#136c6c", "#095050", "#52acac"];

// Function to fetch all todos from the API
const fetchAllTodos = async (token) => {
  try {
    const url = `${API_URL}/todo`; // Construct API URL
    console.log("Fetching todos from:", url); // Log fetching todos URL
    const response = await fetch(`${API_URL}/todo/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
const addTodo = async (todo, token) => {
  try {
    const response = await fetch(`${API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
const deleteTodo = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "DELETE",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    return id; // Return deleted todo ID
  } catch (error) {
    console.error("Error deleting todo:", error); // Log error if deleting todo fails
    return null; // Return null if deleting todo fails
  }
};

// Function to edit a todo

const editTask = async (task, id, token, color = null) => {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: id,
        title: task.title,
        body: task.body,
        color: color,
      }), // Include both body and title properties
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update task: ${response.status} - ${response.statusText}`
      );
    }

    const updatedTodo = await response.json(); // Parse response data

    return updatedTodo; // Return updated todo
  } catch (error) {
    console.error("Error updating task:", error); // Log error if updating task fails
    return null; // Return null if updating task fails
  }
};

// TodoWrapper functional component
export const TodoWrapper = () => {
  const { user, logout } = useUser();
  const [todos, setTodos] = useState([]); // State hook to store todos
  const [isAddTodoVisible, setIsAddTodoVisible] = useState(false); // State hook to control the visibility of AddTodo form
  const navigate = useNavigate();

  // State to keep track of the current color index
  const [colorIndex, setColorIndex] = useState(0);

  // useEffect hook to fetch todos when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.token) {
        try {
          console.log("User token:", user.token); // Log user token
          const fetchedTodos = await fetchAllTodos(user.token);
          setTodos(fetchedTodos);
          // console.log("fooooooooo", user);
        } catch (error) {
          console.error("Error fetching todos:", error);
          setTodos([]); // Clear todos on error to avoid showing stale data
        }
      } else {
        setTodos([]); // Clear todos when user is not authenticated
      }
    };

    fetchData();
  }, [user]);

  const handleAddTodo = async (todo) => {
    // Assign a color from the colors array
    const newColor = colors[colorIndex];
    const newTodo = await addTodo({ ...todo, color: newColor }, user.token);
    if (newTodo) {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      // Update the color index to the next color
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
      setIsAddTodoVisible(false); // Hide the add todo form after successful addition
    }
  };

  // Function to handle deleting a todo
  const handleDeleteTodo = async (id) => {
    const deletedId = await deleteTodo(id, user.token); // Delete todo by ID
    if (deletedId) {
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== deletedId)
      ); // Update todos state by removing deleted todo
    }
  };

  // Function to handle editing a todo
  const handleEditTask = async (task, id) => {
    const updatedTask = await editTask(task, id, user.token); // Edit todo
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

  // Function to update the task color
  const updateTaskColor = async (taskId, color) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      const updatedTask = await editTask(
        taskToUpdate,
        taskId,
        user.token,
        color
      );
      if (updatedTask) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === taskId ? updatedTask : todo))
        );
      }
    }
  };

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // JSX structure returned by the TodoWrapper component
  return (
    <div className="TodoWrapper">
      <h1>
        <span role="img" aria-label="date" className="emoji">
          My To-Do List 📋📝
        </span>
      </h1>
      {/* <AddTodo handleAddTodo={handleAddTodo} /> */}
      <button
        onClick={() => setIsAddTodoVisible(!isAddTodoVisible)}
        className="toggle-add-todo-btn"
      >
        {isAddTodoVisible ? "Hide Add Task" : " Add Task"}
      </button>
      {isAddTodoVisible && <AddTodo handleAddTodo={handleAddTodo} />}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      {/* <div className="todo-list"> */}
      {/* Render AddTodo component for adding todos */}
      {/* Map through todos array and render Todo or EditTodoForm component for each todo */}
      {todos.map((todo) =>
        todo.isEditing ? ( // Check if todo is being edited
          <EditTodoForm // Render EditTodoForm component for editing todo
            key={todo.id}
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
            updateTaskColor={updateTaskColor}
          />
        )
      )}
    </div>
    // </div>
  );
};
