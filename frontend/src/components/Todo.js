// Todo.js

/*
The Todo component represents a single task in the to-do list. 
It displays the task's title and body. 
Users can click on the task title to open a pop-up for editing the task details. 
Additionally, there are icons for editing and deleting tasks. 
Clicking on the edit icon triggers the editTodo function, while clicking on the delete icon
triggers the deleteTodo function. 
The component also includes a pop-up component (TaskPopup) that appears when the task title
is clicked, allowing users to edit task details in a separate window.
*/

// Import necessary components from React and FontAwesome
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import icons from FontAwesome
import { TaskPopup } from "./TaskPopup"; // Import TaskPopup component

// Todo component: displays a single task with options to edit, delete, and mark as completed
// export const Todo = ({ task, deleteTodo, editTodo, setTodos }) => {
export const Todo = (props) => {
  // State to manage whether to show the task popup or not
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle click on task title and display the task popup
  const handleTitleClick = () => {
    setShowPopup(true); // Set showPopup state to true to display the task popup
  };

  return (
    <div className="Todo">
      {/* Display the task title and body */}
      <div>
        <h3 onClick={handleTitleClick}>{props.task.title}</h3>{" "}
        {/* Clicking on the task title opens the popup */}
        <p>{props.task.body}</p> {/* Display task body */}
      </div>

      {/* Icons for editing and deleting tasks */}
      <div>
        {/* Edit icon triggers the editTodo function */}
        <FontAwesomeIcon
          className="edit-icon" // Styling class for the edit icon
          icon={faPen} // FontAwesome pen icon
          onClick={() => props.editTodo(props.task.id)} // Call editTodo function when clicked, passing task ID
        />

        {/* Delete icon triggers the deleteTodo function */}
        <FontAwesomeIcon
          className="delete-icon" // Styling class for the delete icon
          icon={faTrash} // FontAwesome trash icon
          onClick={() => props.deleteTodo(props.task.id)} // Call deleteTodo function when clicked, passing task ID
        />
      </div>

      {/* Render the pop-up if showPopup is true */}
      {showPopup && (
        <TaskPopup
          task={props.task} // Pass the task data to the TaskPopup component
          onClose={() => setShowPopup(false)} // Function to close the popup
          deleteTodo={props.deleteTodo} // Pass the deleteTodo function to the TaskPopup component
          setTodos={props.setTodos} // Pass the setTodos function to the TaskPopup component
        />
      )}
    </div>
  );
};
