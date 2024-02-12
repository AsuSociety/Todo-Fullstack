// Todo.js

// Import necessary components from React and FontAwesome
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

// Todo component: displays a single task with options to edit, delete, and mark as completed
export const Todo = ({ task, deleteTodo, editTodo }) => {
  return (
    <div className="Todo">
      {/* Display the task title and body */}
      <div>
        <h3>{task.title}</h3>
        <p>{task.body}</p>
      </div>

      {/* Icons for editing and deleting tasks */}
      <div>
        {/* Edit icon triggers the editTodo function */}
        <FontAwesomeIcon
          className="edit-icon" // Styling class for the edit icon
          icon={faPen} // FontAwesome pen icon
          onClick={() => editTodo(task.id)} // Call editTodo function when clicked, passing task ID
        />

        {/* Delete icon triggers the deleteTodo function */}
        <FontAwesomeIcon
          className="delete-icon" // Styling class for the delete icon
          icon={faTrash} // FontAwesome trash icon
          onClick={() => deleteTodo(task.id)} // Call deleteTodo function when clicked, passing task ID
        />
      </div>
    </div>
  );
};
