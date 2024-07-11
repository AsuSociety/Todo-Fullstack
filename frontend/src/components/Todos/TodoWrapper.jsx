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
import { AddTodo } from "./AddTodo"; // Import AddTodo component for adding todos
import { TaskTable } from "./TaskTable";
import axios from "axios";

import { Profile } from "./Profile";

import { Button } from "@/components/ui/button";

// Define API_URL constant for API endpoint
export const API_URL = "http://localhost:8000";
// Define an array of colors
const colors = ["#ef4444", "#f59e0b", "#84cc16", "#71717a"];

// Function to fetch all todos from the API
const fetchAllTodos = async (token) => {
  try {
    // const url = `${API_URL}/todo`; // Construct API URL
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
      formData.append('files', file); // Use the key 'file' for each file
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

// const handleUpload = async (selectedFile, todoId, token) => {
//   try {
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     const response = await axios.post(
//       `${API_URL}/todo/upload/${todoId}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );

//     if (response.status !== 200) {
//       throw new Error(
//         `Failed to upload file: ${response.status} - ${response.statusText}`,
//       );
//     }

//     console.log("File uploaded successfully", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return null;
//   }
// };

const updateIcon = async (userId, icon, token) => {
  try {
    const response = await fetch(`${API_URL}/auth/${userId}/icon`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ icon: icon }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update icon: ${response.status} - ${response.statusText}`,
      );
    }

    const result = await response.json();
    // console.log("Icon updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating icon:", error);
    return null;
  }
};

// const sendEmail = async (email, token) => {
//   try {
//     // Append the email to the URL as a query parameter
//     const response = await fetch(`${API_URL}/todo/send-test-email?email=${encodeURIComponent(email)}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       // No body needed since email is in the query string
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`Failed to send email: ${response.status} - ${response.statusText}. Error details: ${JSON.stringify(errorData)}`);
//     }

//     const result = await response.json();
//     console.log("Email sent successfully:", result);
//     return result;
//   } catch (error) {
//     console.error("Error sending email:", error.message);
//     return null;
//   }
// };

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
  const [isAddTodoVisible, setIsAddTodoVisible] = useState(false); // State hook to control the visibility of AddTodo form

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

  const handleAddTodo = async (todo) => {
    // Assign a color from the colors array
    const newColor = colors[3];
    const newTodo = await addTodo(
      {
        ...todo,
        color: newColor,
        status: "",
        deadline: getDefaultDeadline(),
        remainder: true,
      },
      user.token,
    );
    if (newTodo) {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setIsAddTodoVisible(false); // Hide the add todo form after successful addition
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

  const updatUserIcon = async (userId, icon) => {
    const updatedUser = await updateIcon(userId, icon, user.token);
    if (updatedUser) {
      // console.log("Icon updated successfully");
    } else {
      console.error("Task update failed.");
    }
  };

  const handleUploadClick = async (taskId, selectedFile) => {
    if (selectedFile) {
      await handleUpload(selectedFile, taskId, user.token);
    }
  };

  // test for the mail service
  // const handleClick = async () => {
  //   if (user && user.token) {
  //     const result = await sendEmail('omerasus3@gmail.com', user.token);

  //     if (result) {
  //       alert('Test email sent!');
  //     } else {
  //       alert('Failed to send test email.');
  //     }
  //   } else {
  //     alert('User is not authenticated.');
  //   }
  // };

  // JSX structure returned by the TodoWrapper component
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back {user.username}!
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Profile updateIcon={updatUserIcon} user={user} />
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={() => setIsAddTodoVisible(!isAddTodoVisible)}
          className="text-white py-1 px-3 rounded transition duration-300 bg-blue-500 hover:bg-blue-600"
        >
          {isAddTodoVisible ? "Hide Add Task" : "Add Task"}
        </Button>
        {isAddTodoVisible && (
          <div className="w-full transition-opacity duration-300 ease-in-out">
            <AddTodo handleAddTodo={handleAddTodo} />
          </div>
        )}
      </div>

      {/* <Button onClick={handleClick}>Send Test Email</Button> */}

      <TaskTable
        tasks={todos} // Pass todo as prop
        deleteTodo={handleDeleteTodo} // Pass deleteTodo function as prop
        handleSave={handleSave} // Pass markForEdit function as prop
        updateTaskStatus={updateTaskStatus}
        updateDeadline={updateDeadline}
        updateRemainder={updateRemainder}
        normalizeDate={normalizeDate}
        convertToUTCISO={convertToUTCISO}
        handleUploadClick={handleUploadClick}
        user={user}
      />
    </div>
  );
};
