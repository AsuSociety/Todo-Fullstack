// TodoForm.js

// Import React and useState hook
import React, { useState } from "react";

// TodoForm component: allows adding new tasks
export const TodoForm = ({ handleAddTodo }) => {
  // State to manage the input value for new tasks

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Check if the input value is not empty
    if (title && body) {
      // Call the addTodo function to add a new task
      handleAddTodo({ title, body });
      setTitle("");
      setBody("");
    }
  };

  // Return a form with an input field and a submit button
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      {/* Input field for entering a new task */}
      <input
        type="text"
        value={title} // The current value of the input field is displayed
        onChange={(e) => setTitle(e.target.value)}
        className="todo-input"
        placeholder="Title"
      />

      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="todo-input"
        placeholder="Body"
      />

      {/* Submit button to add the new task */}
      <button type="submit" className="todo-btn">
        Add Task
      </button>
    </form>
  );
};
