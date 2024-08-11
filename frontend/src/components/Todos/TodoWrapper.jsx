// TodoWrapper.js
import React, { useState, useEffect } from "react"; 
import { useUser } from "../UserContext";
import { TaskTable } from "./TaskTable";
import { CalendarView } from "./CalendarView";
import { KanbanBoard } from "./KanbanBoard";
import { Toolbar } from "./Toolbar";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faTable,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { Profile } from "./Profile";
import { Button } from "@/components/ui/button";

export const API_URL = "http://localhost:8000";
const colors = ["#ffb3ba", "#ffdfba", "#baffc9", "#bae1ff"];

const fetchAllTodos = async (token) => {
  try {
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

    const data = await response.json(); 
    console.log("Response data:", data);

    return data;
  } catch (error) {
    console.error(`Error fetching todos${""}:`, error); 
    return []; 
  }
};

const addTodo = async (todo, token) => {
  try {
    const response = await fetch(`${API_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(todo), 
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add todo: ${response.status} - ${response.statusText}`,
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

const deleteTodo = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }

    return id; 
  } catch (error) {
    console.error("Error deleting todo:", error); 
    return null; 
  }
};

const editTask = async (
  task,
  id,
  token,
  color = null,
  status = null,
  deadline = null,
  remainder = true,
  visibility,
  assignee_id,
) => {
  const payload = {
    title: task.title,
    body: task.body,
    color: color,
    status: status,
    deadline: deadline,
    remainder: remainder,
    visibility: visibility,
    assignee_id: assignee_id,
  };


  try {
    const response = await fetch(`${API_URL}/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response:", errorResponse); 
      throw new Error(
        `Failed to update task: ${response.status} - ${response.statusText}`,
      );
    }

    const updatedTodo = await response.json();

    return updatedTodo;
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};

const handleUpload = async (selectedFiles, todoId, token) => {
  const formData = new FormData();

  selectedFiles.forEach((file) => {
    formData.append("files", file); 
  });

  try {
    const response = await fetch(`${API_URL}/todo/upload/${todoId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error response:", errorResponse);
      throw new Error(
        `Failed to upload files: ${response.status} - ${response.statusText}`,
      );
    }

    const updatedTask = await response.json(); 
    console.log("Files uploaded and task updated successfully", updatedTask);

    return updatedTask;
  } catch (error) {
    console.error("Error uploading files:", error);
    return null;
  }
};

const deletePhoto = async (photoId, todoId, token) => {
  try {
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

const convertToUTCISO = (date) => {
  const localDate = new Date(date);
  const year = localDate.getFullYear();
  const month = localDate.getMonth();
  const day = localDate.getDate();
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const seconds = localDate.getSeconds();
  const milliseconds = localDate.getMilliseconds();

  const utcDate = new Date(
    Date.UTC(year, month, day, hours, minutes, seconds, milliseconds),
  );
  return utcDate.toISOString();
};

export const TodoWrapper = () => {
  const { user } = useUser();
  const [todos, setTodos] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); 
  const [view, setView] = useState("table"); 
  const [filterTitle, setFilterTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterVisibility, setFilterVisibility] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.token) { 
        try {
          const fetchedTodos = await fetchAllTodos(user.token);
          setTodos(fetchedTodos);
        } catch (error) {
          console.error("Error fetching todos:", error);
          setTodos([]); 
        }
      } else {
        setTodos([]); 
      }
    };
    fetchData();
  }, [user]);

  const handleAddTask = async () => {
    const newTask = {
      title: "New Task",
      body: "",
      color: colors[3],
      status: "todo",
      deadline: null,
      remainder: true,
      visibility: "private",
      assignee_id: null,
    };

    const addedTask = await addTodo(newTask, user.token);
    if (addedTask) {
      setTodos((prevTodos) => [addedTask, ...prevTodos]);
      setSelectedTask(addedTask);
    }
  };

  const handleAddTaskInCalendar = async (date) => {
    const newTask = {
      title: "New Task",
      body: "",
      color: colors[3], 
      status: "todo",
      deadline: date,
      remainder: true,
      visibility: "private",
      assignee_id: null,
    };

    const addedTask = await addTodo(newTask, user.token);
    if (addedTask) {
      setTodos((prevTodos) => [addedTask, ...prevTodos]);
      setSelectedTask(addedTask);
    }
  };

  const handleDeleteTodo = async (id) => {
    const deletedId = await deleteTodo(id, user.token); 
    if (deletedId) {
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== deletedId),
      ); 
    }
  };

  const handleSave = async (task, id) => {
    const updatedTask = await editTask(
      task,
      id,
      user.token,
      task.color,
      task.status,
      task.deadline ? new Date(task.deadline).toISOString() : null,
      task.remainder,
      task.visibility,
      task.assignee_id,
    );

    if (updatedTask) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? updatedTask : todo)),
      );
    } else {
      console.error("Task update failed.");
    }
  };

  const updateTaskTitle = async (taskId, title) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      await handleSave({ ...taskToUpdate, title }, taskId);
    }
  };

  const updateTaskDescription = async (taskId, body) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      await handleSave({ ...taskToUpdate, body }, taskId);
    }
  };

  // Function to update the task status
  const updateTaskStatus = async (taskId, color, status) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      handleSave({ ...taskToUpdate, status, color }, taskId);
    }
  };

  const updateDeadline = async (taskId, deadline) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      handleSave({ ...taskToUpdate, deadline }, taskId);
    }
  };

  const updateRemainder = async (taskId, remainder) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      handleSave({ ...taskToUpdate, remainder }, taskId);
    }
  };

  const updateVisibility = async (taskId, visibility) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      handleSave({ ...taskToUpdate, visibility }, taskId);
    }
  };

  const updateAssignees = async (taskId, assignee_id) => {
    const taskToUpdate = todos.find((todo) => todo.id === taskId);
    if (taskToUpdate) {
      handleSave({ ...taskToUpdate, assignee_id }, taskId);
    }
  };

  const handleUploadClick = async (taskId, selectedFile, task) => {
    if (selectedFile) {
      const updatedTask = await handleUpload(selectedFile, taskId, user.token);
      if (updatedTask) {
        handleSave(updatedTask, taskId);
      }
    }
  };

  const handleDeletePhoto = async (photoId, todoId) => {
    const deletedPhoto = await deletePhoto(photoId, todoId, user.token);
    if (deletedPhoto) {
      const updatedTodos = todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              photos: Array.isArray(todo.photos)
                ? todo.photos.filter((photo) => photo.id !== photoId)
                : [],
            }
          : todo,
      );
      
      setTodos(updatedTodos);
      
      const updatedTask = updatedTodos.find(todo => todo.id === todoId);
      if (updatedTask) {
        await handleSave(updatedTask, todoId);
      }
    }
  };
  

  const filteredTodos = todos.filter((todo) => {
    const matchesTitle = todo.title
      .toLowerCase()
      .includes(filterTitle.toLowerCase());
    const matchesStatus = filterStatus.length > 0 
      ? filterStatus.includes(todo.status)
      : true;
    const matchesVisibility = filterVisibility
      ? todo.visibility === filterVisibility
      : true;
  
    return matchesTitle && matchesStatus && matchesVisibility;
  });
  

  return (
    <div className="h-full flex flex-col p-8">
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
            <Profile />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-6">
        <div className="flex justify-between mb-6">
          <div className="flex flex-col">
            <Toolbar
              filterTitle={filterTitle}
              setFilterTitle={setFilterTitle}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterVisibility={filterVisibility}
              setFilterVisibility={setFilterVisibility}
              resetFilters={() => {
                setFilterTitle("");
                setFilterStatus([]);
                setFilterVisibility("");
              }}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Button
                onClick={() => setView("table")}
                className={`p-2 flex items-center justify-center border-transparent ${
                  view === "table" ? "border-b-2 border-[#BBD6B8]" : ""
                }`}
                style={{ background: "none", border: "none" }}
              >
                <FontAwesomeIcon
                  icon={faTable}
                  className={`text-lg ${view === "table" ? "text-[#BBD6B8]" : "text-gray-500"}`}
                />
              </Button>
              <Button
                onClick={() => setView("calendar")}
                className={`p-2 flex items-center justify-center border-transparent ${
                  view === "calendar" ? "border-b-2 border-[#BBD6B8]" : ""
                }`}
                style={{ background: "none", border: "none" }}
              >
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className={`text-lg ${view === "calendar" ? "text-[#BBD6B8]" : "text-gray-500"}`}
                />
              </Button>
              <Button
                onClick={() => setView("kanban")}
                className={`p-2 flex items-center justify-center border-transparent ${
                  view === "kanban" ? "border-b-2 border-[#BBD6B8]" : ""
                }`}
                style={{ background: "none", border: "none" }}
              >
                <FontAwesomeIcon
                  icon={faClipboard}
                  className={`text-lg ${view === "kanban" ? "text-[#BBD6B8]" : "text-gray-500"}`}
                />
              </Button>
            </div>
            <Button
              variant="ghost"
              onClick={handleAddTask}
              className="text-black py-1 px-3 rounded transition duration-300"
              style={{ backgroundColor: "#BBD6B8" }}
            >
              Add Task ➕
            </Button>
          </div>
        </div>

        {view === "table" && (
          <TaskTable
            tasks={filteredTodos}
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
            updateVisibility={updateVisibility}
            updateAssignees={updateAssignees}
            updateTaskDescription={updateTaskDescription}
            updateTaskTitle={updateTaskTitle}
          />
        )}

        {view === "calendar" && (
          <CalendarView
            tasks={filteredTodos}
            setTodos={setTodos}
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
            updateVisibility={updateVisibility}
            updateAssignees={updateAssignees}
            updateTaskDescription={updateTaskDescription}
            updateTaskTitle={updateTaskTitle}
          />
        )}

        {view === "kanban" && (
          <KanbanBoard
            tasks={filteredTodos}
            updateTaskStatus={updateTaskStatus}
          />
        )}
      </div>
    </div>
  );
};
