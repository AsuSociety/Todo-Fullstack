// TaskPopup.js

/*
This code creates a pop-up window that shows details about a task.
It lets you edit the task's title and body, save changes, or cancel editing.
You can also delete the task. If you're not editing, it shows the task's details and gives options to edit or delete it.
It's like a little window that helps you manage your tasks easily!
*/

import React, { useState } from "react"; // Import React and useState hook
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon for icons
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import icons
import "./TaskPopup.css"; // Import styles

export const TaskPopup = ({ task, onClose, deleteTodo, setTodos }) => {
  // Define TaskPopup component with props
  // State variables to manage edit mode and edited title/body
  const [editMode, setEditMode] = useState(false); // State to track if the component is in edit mode
  const [editedTitle, setEditedTitle] = useState(task.title); // State to hold the edited title
  const [editedBody, setEditedBody] = useState(task.body); // State to hold the edited body

  // Function to send PUT request to update task on the server
  const editTask = async (task, id) => {
    try {
      const response = await fetch(`http://localhost:8000/todo/${id}`, {
        // Send PUT request to update task
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, title: task.title, body: task.body }), // Include both body and title properties
      });

      const updatedTodo = await response.json(); // Parse response JSON

      return updatedTodo; // Return updated task
    } catch (error) {
      console.error("Error updating task:", error); // Log error if update fails
      return null; // Return null
    }
  };

  // Event handler to enable edit mode
  const handleEdit = () => {
    setEditMode(true); // Set editMode state to true
  };

  // Event handler to save edited task
  const handleSave = async (task, id) => {
    const updatedTask = await editTask(
      // Call editTask function to save changes
      { title: editedTitle, body: editedBody }, // Pass edited title and body
      task.id // Pass task ID
    );

    if (updatedTask) {
      // If task is updated successfully
      setTodos(
        (
          prevTodos // Update todos state with the updated task
        ) => prevTodos.map((todo) => (todo.id === id ? updatedTask : todo))
      );
    }
    setEditMode(false); // Exit edit mode
  };

  // Event handler to cancel editing
  const handleCancel = () => {
    // Reset edited title/body to original task values
    setEditedTitle(task.title);
    setEditedBody(task.body);
    setEditMode(false); // Exit edit mode
  };

  // Event handler to delete task
  const handleDelete = () => {
    deleteTodo(task.id); // Call deleteTodo function to delete task
    onClose(); // Close popup
  };

  // Render list items for each body item
  const bodyItems = task.body
    .split(",")
    .map((item, index) => <li key={index}>{item.trim()}</li>);

  // Render the popup
  return (
    <div className="task-popup-overlay">
      {" "}
      {/* Popup overlay */}
      <div className="task-popup">
        {" "}
        {/* Popup content */}
        {/* Close button */}
        <span className="task-popup-close" onClick={onClose}>
          &times;
        </span>
        {/* Render either edit mode or display mode */}
        {editMode ? ( // If in edit mode
          <div>
            {/* Input fields for edited title/body */}
            <input
              type="text"
              value={editedTitle} // Display edited title
              onChange={(e) => setEditedTitle(e.target.value)} // Update edited title
              className="task-popup-input"
            />
            <input
              type="text"
              value={editedBody} // Display edited body
              onChange={(e) => setEditedBody(e.target.value)} // Update edited body
              className="task-popup-input"
            />

            {/* Save and cancel buttons */}
            <div className="task-popup-buttons">
              <button
                onClick={() => handleSave(task, task.id)} // Save changes
                className="task-popup-button"
              >
                Save
              </button>
              <button onClick={handleCancel} className="task-popup-button">
                {/* Cancel editing */}
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // If not in edit mode
          <div>
            {/* Display task title */}
            <h2 className="task-popup-title">{task.title}</h2>

            {/* Render list of body items */}
            <ul className="task-popup-body">{bodyItems}</ul>

            {/* Edit and delete icons */}
            <div className="task-popup-buttons">
              <FontAwesomeIcon
                className="edit-icon"
                icon={faPen} // Edit icon
                onClick={handleEdit} // Enable edit mode
              />
              <FontAwesomeIcon
                className="delete-icon"
                icon={faTrash} // Delete icon
                onClick={handleDelete} // Delete task
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
