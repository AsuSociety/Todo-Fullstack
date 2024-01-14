// EditTodoForm.js

// Import React and useState hook
import React, { useState } from "react";

// EditTodoForm component: allows editing an existing task
export const EditTodoForm = ({ editTodo, task }) => {
  // State to manage the input value for editing

  const [value, setValue] = useState(task.task);

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Call the editTodo function to update the task with the new value
    editTodo(value, task.id);
  };

  // Return a form with an input field and a submit button
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      {/* Input field for updating the task */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="todo-input"
        placeholder="Update task"
      />

      {/* Submit button to apply the changes */}
      <button type="submit" className="todo-btn">
        Update Task
      </button>
    </form>
  );
};
