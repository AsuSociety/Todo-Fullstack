import React, { useState } from "react"; // Import React and useState hook
import { useUser } from "../UserContext"; // Import useUser hook for user context
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon for icons
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import icons
// import "./TaskPopup.css"; // Import styles

export const TaskPopup = ({ task, onClose, deleteTodo, setTodos }) => {
  const { user } = useUser(); // Get user context
  const [editMode, setEditMode] = useState(false); // State to track if the component is in edit mode
  const [editedTitle, setEditedTitle] = useState(task.title); // State to hold the edited title
  const [editedBody, setEditedBody] = useState(task.body); // State to hold the edited body

  // Function to send PUT request to update task on the server
  const editTask = async (id, title, body, token) => {
    try {
      const response = await fetch(`http://localhost:8000/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          title: title,
          body: body,
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

  // Event handler to enable edit mode
  const handleEdit = () => {
    setEditMode(true); // Set editMode state to true
  };

  // Event handler to save edited task
  const handleSave = async () => {
    const updatedTask = await editTask(
      task.id,
      editedTitle,
      editedBody,
      user.token
    ); // Edit todo
    if (updatedTask) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === task.id ? updatedTask : todo))
      ); // Update todos state with updated todo
      setEditMode(false); // Exit edit mode
      onClose(); // Close popup
    } else {
      console.error("Task update failed."); // Log error if task update failed
    }
  };

  // Event handler to cancel editing
  const handleCancel = () => {
    setEditedTitle(task.title); // Reset edited title to original task title
    setEditedBody(task.body); // Reset edited body to original task body
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
      <div className="task-popup">
        <span className="task-popup-close" onClick={onClose}>
          &times;
        </span>
        {editMode ? ( // If in edit mode
          <div>
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

            <div className="task-popup-buttons">
              <button
                onClick={handleSave} // Save changes
                className="task-popup-button"
              >
                Save
              </button>
              <button onClick={handleCancel} className="task-popup-button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="task-popup-title">{task.title}</h2>
            <ul className="task-popup-body">{bodyItems}</ul>

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
