// Todo.js

// Import necessary components from React and FontAwesome
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

// Todo component: displays a single task with options to edit, delete, and mark as completed
export const Todo = ({ task, deleteTodo, editTodo, toggleComplete }) => {
  return (
    <div className="Todo">
      {/* Display the task with a class based on completion status */}
      <p
        className={`${task.completed ? "completed" : "incompleted"}`}
        onClick={() => toggleComplete(task.id)}
      >
        {task.task}
      </p>

      {/* Icons for editing and deleting tasks */}
      <div>
        {/* Edit icon triggers the editTodo function */}
        <FontAwesomeIcon
          className="edit-icon"
          icon={faPen}
          onClick={() => editTodo(task.id)}
        />
        {/* Delete icon triggers the deleteTodo function */}
        <FontAwesomeIcon
          className="delete-icon"
          icon={faTrash}
          onClick={() => deleteTodo(task.id)}
        />
      </div>
    </div>
  );
};
