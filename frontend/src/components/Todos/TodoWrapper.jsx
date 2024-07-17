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
import { useUser } from "../UserContext";
import { TaskTable } from "./TaskTable";
import {CalendarView} from "./CalendarView";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar,faTable, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { Profile } from "./Profile";

import { Button } from "@/components/ui/button";

// Define API_URL constant for API endpoint
export const API_URL = "http://localhost:8000";
// Define an array of colors
const colors = ["#ef4444", "#f59e0b", "#84cc16", "#71717a"];

// Function to fetch all todos from the API
const fetchAllTodos = async (token) => {
  try {
    // console.log("Fetching todos from:", url); // Log fetching todos URL
    const response = await fetch(`${API_URL}/todo/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos: ${response.status} - ${response.statusText}`,
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
        `Failed to add todo: ${response.status} - ${response.statusText}`,
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
const editTask = async (
  task,
  id,
  token,
  color = null,
  status = null,
  date,
  remainder,
) => {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: task.title,
        body: task.body,
        color: color,
        status: status,
        deadline: date,
        remainder: remainder,
      }), // Include both body and title properties
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update task: ${response.status} - ${response.statusText}`,
      );
    }

    const updatedTodo = await response.json(); // Parse response data
    // console.log("EDIT TASK##########")
    return updatedTodo; // Return updated todo
  } catch (error) {
    console.error("Error updating task:", error); // Log error if updating task fails
    return null; // Return null if updating task fails
  }
};
const handleUpload = async (selectedFiles, todoId, token) => {
  try {
    const formData = new FormData();

    // Loop through the array of files and append each one to the FormData
    selectedFiles.forEach((file) => {
      formData.append("files", file); // Use the key 'file' for each file
    });

    const response = await axios.post(
      `${API_URL}/todo/upload/${todoId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to upload files: ${response.status} - ${response.statusText}`,
      );
    }

    console.log("Files uploaded successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading files:", error);
    return null;
  }
};


const deletePhoto = async (photoId, todoId, token) => {
  try {
    // Send DELETE request to API
    const response = await axios.delete(`${API_URL}/todo/photos/${photoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to delete photo: ${response.status} - ${response.statusText}`,
      );
    }

    console.log("Photo deleted successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting photo:", error);
    return null;
  }
};

// Function to normalize date to start of the day in local timezone

const normalizeDate = (date) => {
  const newDate = new Date(date);
  const now = new Date();

  newDate.setHours(
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );
  return newDate;
};

// Convert local date to UTC ISO string, fix the problem with the different time
const convertToUTCISO = (date) => {
  // Assuming date is a Date object
  const localDate = new Date(date);
  // Get year, month, date, hours, minutes, seconds, and milliseconds
  const year = localDate.getFullYear();
  const month = localDate.getMonth();
  const day = localDate.getDate();
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const seconds = localDate.getSeconds();
  const milliseconds = localDate.getMilliseconds();

  // Create a new UTC date object
  const utcDate = new Date(
    Date.UTC(year, month, day, hours, minutes, seconds, milliseconds),
  );
  return utcDate.toISOString();
};

// Function to get the default deadline (3 days from now)
const getDefaultDeadline = () => {
  const today = new Date();
  today.setDate(today.getDate() + 3); // Add 3 days

  const normalizedDate = normalizeDate(today);
  return convertToUTCISO(normalizedDate);
};

// TodoWrapper functional component
export const TodoWrapper = () => {
  const { user } = useUser();
  const [todos, setTodos] = useState([]); // State hook to store todos
  const [selectedTask, setSelectedTask] = useState(null); // State for selected task to open Task component
  const [view, setView] = useState("table"); // State for toggling view

  const navigate = useNavigate();

  // useEffect hook to fetch todos when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.token) {
        try {
          const fetchedTodos = await fetchAllTodos(user.token);
          setTodos(fetchedTodos);
        } catch (error) {
          console.error("Error fetching todos:", error);
          setTodos([]); // Clear todos on error to avoid showing stale data
        }
      } else {
        setTodos([]); // Clear todos when user is not authenticated
      }
    };
    // console.log("fooooooooooo",user)
    fetchData();
  }, [user]);

  const handleAddTask = async () => {
    const defaultDeadline = getDefaultDeadline(); // Example default deadline
    const newTask = {
      title: "New Task",
      body: "",
      color: colors[3], // Default color
      status: "",
      deadline: defaultDeadline,
      remainder: true,
    };

    const addedTask = await addTodo(newTask, user.token);
    if (addedTask) {
      setTodos((prevTodos) => [addedTask, ...prevTodos]);
      setSelectedTask(addedTask);
    }
  };

  const handleAddTaskInCalendar = async (date) => {
    // const defaultDeadline = getDefaultDeadline(); // Example default deadline
    const newTask = {
      title: "New Task",
      body: "",
      color: colors[3], // Default color
      status: "",
      deadline: date,
      remainder: true,
    };

    const addedTask = await addTodo(newTask, user.token);
    if (addedTask) {
      setTodos((prevTodos) => [addedTask, ...prevTodos]);
      setSelectedTask(addedTask);
    }
  };


  // Function to handle deleting a todo
  const handleDeleteTodo = async (id) => {
    const deletedId = await deleteTodo(id, user.token); // Delete todo by ID
    if (deletedId) {
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== deletedId),
      ); // Update todos state by removing deleted todo
    }
  };

  const handleSave = async (task, id) => {
    const updatedTask = await editTask(
      task,
      id,
      user.token,
      task.color,
      task.status,
      task.deadline,
      task.remainder,
    );
    if (updatedTask) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTask : todo)),
      );
    } else {
      console.error("Task update failed.");
    }
    // console.log("$$$$$$$$$",updatedTask)
  };

  // Function to update the task status
  const updateTaskStatus = async (taskId, color, status) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      const updatedTask = await editTask(
        taskToUpdate,
        taskId,
        user.token,
        color,
        status,
        taskToUpdate.deadline,
        taskToUpdate.remainder,
      );
      if (updatedTask) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === taskId ? updatedTask : todo)),
        );
      }
    }
  };

  // Function to update the deadline status
  const updateDeadline = async (taskId, date) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      const updatedTask = await editTask(
        taskToUpdate,
        taskId,
        user.token,
        taskToUpdate.color,
        taskToUpdate.status,
        date,
        taskToUpdate.remainder,
      );
      if (updatedTask) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === taskId ? updatedTask : todo)),
        );
      }
    }
  };

  const updateRemainder = async (taskId, remainder) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      const updatedTask = await editTask(
        taskToUpdate,
        taskId,
        user.token,
        taskToUpdate.color,
        taskToUpdate.status,
        taskToUpdate.deadline,
        remainder,
      );
      if (updatedTask) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === taskId ? updatedTask : todo)),
        );
      }
    }
  };

  const handleUploadClick = async (taskId, selectedFile) => {
    if (selectedFile) {
      const uploadedData = await handleUpload(selectedFile, taskId, user.token);
      if (uploadedData) {
        // Update the task in the todos state with the new photo information
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === taskId ? uploadedData : todo)),
        );
      }
    }
  };

  const handleDeletePhoto = async (photoId, todoId) => {
    const deletedPhoto = await deletePhoto(photoId, todoId, user.token);
    if (deletedPhoto) {
      // Update the task in the todos state by removing the deleted photo
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId
            ? {
                ...todo,
                photos: Array.isArray(todo.photos)
                  ? todo.photos.filter((photo) => photo.id !== photoId)
                  : [], // Set to empty array if photos is not defined
              }
            : todo,
        ),
      );
    }
  };

    // Toggle view between table and calendar
    const toggleView = () => {
      setView((prevView) => (prevView === "table" ? "calendar" : "table"));
    };
  

  // JSX structure returned by the TodoWrapper component
  return (
    <div className="h-full flex flex-col p-8">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="flex items-center justify-between space-y-2 p-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back {user.first_name}!
            </h2>
            <p className="text-muted-foreground">
              Here's a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon
              icon={view === "calendar" ? faTable : faCalendarDays}
              className="text-gray-600 cursor-pointer hover:text-cyan-600"
              onClick={toggleView}
            />
            <Profile />
          </div>
        </div>
      </div>
  
      {/* Content area that scrolls */}
      <div className="flex-1 overflow-y-auto mt-4">
        {/* Add Task button */}
        <div className="flex justify-center pb-4">
          <Button
            variant="ghost"
            onClick={handleAddTask}
            className="text-white py-1 px-3 rounded transition duration-300 bg-blue-500 hover:bg-blue-600"
          >
            Add Task
          </Button>
        </div>
  
        {/* TaskTable or CalendarView */}
        {view === "table" ? (
          <TaskTable
            tasks={todos}
            deleteTodo={handleDeleteTodo}
            handleSave={handleSave}
            updateTaskStatus={updateTaskStatus}
            updateDeadline={updateDeadline}
            updateRemainder={updateRemainder}
            normalizeDate={normalizeDate}
            convertToUTCISO={convertToUTCISO}
            handleUploadClick={handleUploadClick}
            user={user}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            handleDeletePhoto={handleDeletePhoto}
          />
        ) : (
          <CalendarView
            tasks={todos}
            setTodos ={setTodos}
            handleAddTask={handleAddTaskInCalendar}
            handleSave={handleSave}
            handleDeleteTodo={handleDeleteTodo}
            updateTaskStatus={updateTaskStatus}
            updateDeadline={updateDeadline}
            updateRemainder={updateRemainder}
            normalizeDate={normalizeDate}
            convertToUTCISO={convertToUTCISO}
            handleUploadClick={handleUploadClick}
            user={user}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            handleDeletePhoto={handleDeletePhoto}
          />
        )}
      </div>
    </div>
  );
  
  
};