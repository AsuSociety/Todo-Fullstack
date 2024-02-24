// TodoForm.js

/*
This component manages the input of new tasks with two controlled input fields for the title and body. 
Upon submission of the form, it triggers a function to add the new task to the todo list if both fields are filled. 
This component ensures a user-friendly interface for seamlessly adding tasks to the list.
*/

// Import React and useState hook
import React, { useState } from "react";

// TodoForm component: allows adding new tasks
// export const TodoForm = ({ handleAddTodo }) => {
export const TodoForm = (props) => {
  // State to manage the input value for new tasks
  const [title, setTitle] = useState(""); // State for task title
  const [body, setBody] = useState(""); // State for task body

  // Function to handle form submission
  const handleSubmit = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Check if both title and body are not empty
    if (title && body) {
      // Call the addTodo function passed as prop to add a new task
      props.handleAddTodo({ title, body }); // Pass title and body as an object to handleAddTodo function
      // Clear input fields after adding the task
      setTitle(""); // Clear title input field
      setBody(""); // Clear body input field
    }
  };

  // Return a form with input fields for title and body, and a submit button
  return (
    <form onSubmit={handleSubmit} className="TodoForm">
      {/* Input field for entering the title of the task */}
      <input
        type="text"
        value={title} // Value of the input field is set to the current value of 'title' state
        onChange={(e) => setTitle(e.target.value)} // Update 'title' state as user types
        className="todo-input"
        placeholder="Title"
      />

      {/* Input field for entering the body of the task */}
      <input
        type="text"
        value={body} // Value of the input field is set to the current value of 'body' state
        onChange={(e) => setBody(e.target.value)} // Update 'body' state as user types
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
