// TodoForm.js

// Import React and useState hook
import React, { useState } from "react";

// TodoForm component: allows adding new tasks
export const TodoForm = ({ handleAddTodo }) => {
  // State to manage the input value for new tasks
  const [value, setValue] = useState(""); // Set up a state variable 'value' to hold the input value

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Check if the input value is not empty
    if (value) {
      // Call the addTodo function to add a new task
      handleAddTodo(value); // Pass the current input value to the 'addTodo' function
      // Clear the form input after submission
      setValue(""); // Reset the input value to an empty string
    }
  };

  // Return a form with an input field and a submit button
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      {/* Input field for entering a new task */}
      <input
        type="text"
        value={value} // The current value of the input field is displayed
        onChange={(e) => setValue(e.target.value)} // Update the 'value' as the user types
        className="todo-input"
        placeholder="What is the task today?"
      />

      {/* Submit button to add the new task */}
      <button type="submit" className="todo-btn">
        Add Task
      </button>
    </form>
  );
};
