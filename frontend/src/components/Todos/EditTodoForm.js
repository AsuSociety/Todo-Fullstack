// EditTodoForm.js

/*
The EditTodoForm component allows users to edit an existing task. 
It provides input fields for updating the task's title and body. 
Users can type in the new title and body values, and when they submit the form, 
the changes are applied to the task using the editTodo function. 
Overall, this component facilitates the editing process for tasks in the to-do list.
*/

// Import React and useState hook
import React, { useState } from "react";
import "./EditTodoForm.css";

// EditTodoForm component: allows editing an existing task
// export const EditTodoForm = ({ editTodo, task }) => {
export const EditTodoForm = (props) => {
  // State to manage the input value for editing
  const [title, setTitle] = useState(props.task.title); // State for task title
  const [body, setBody] = useState(props.task.body); // State for task body

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();
    // Call the editTodo function to update the task with the new value
    props.editTodo({ title, body }, props.task.id); // Pass updated title, body, and task ID to the editTodo function
  };

  // Return a form with an input field and a submit button
  return (
    <form onSubmit={handleSubmit} className="EditTodoForm">
      {/* Input field for updating the task title */}
      <input
        type="text"
        value={title} // Value of the input field is set to the current value of 'title' state
        onChange={(e) => setTitle(e.target.value)} // Update 'title' state as user types
        // className="todo-input"
        placeholder="Update title" // Placeholder text for the input field
      />
      {/* Input field for updating the task body */}
      <input
        type="text"
        value={body} // Value of the input field is set to the current value of 'body' state
        onChange={(e) => setBody(e.target.value)} // Update 'body' state as user types
        placeholder="Update body" // Placeholder text for the input field
      />

      {/* Submit button to apply the changes */}
      <button type="submit" className="todo-btn">
        Update Task
      </button>
    </form>
  );
};
