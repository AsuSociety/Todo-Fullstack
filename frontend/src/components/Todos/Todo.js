// Todo.js

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPalette } from "@fortawesome/free-solid-svg-icons";
import { TaskPopup } from "./TaskPopup";
export const Todo = (props) => {
  // Define an array of colors
  const colors = ["#2f8f8f", "#1d9c9c", "#136c6c", "#095050", "#52acac"];

  const [showPopup, setShowPopup] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [taskColor, setTaskColor] = useState(props.task.color || colors[0]);

  // Function to handle color change
  const handleColorChange = (color) => {
    setTaskColor(color);
    setShowColorPicker(false);
    props.updateTaskColor(props.task.id, color);
  };

  const handleTitleClick = () => {
    setShowPopup(true);
  };

  return (
    <div
      className="Todo"
      style={{ backgroundColor: taskColor }} // Set background color dynamically
    >
      <div>
        <h3 onClick={handleTitleClick}>{props.task.title}</h3>
        <p>{props.task.body}</p>
      </div>

      <div>
        <FontAwesomeIcon
          className="edit-icon"
          icon={faPen}
          onClick={() => props.editTodo(props.task.id)}
        />
        <FontAwesomeIcon
          className="delete-icon"
          icon={faTrash}
          onClick={() => props.deleteTodo(props.task.id)}
        />

        <FontAwesomeIcon
          className="palette-icon"
          icon={faPalette}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
      </div>

      {showPopup && (
        <TaskPopup
          task={props.task}
          onClose={() => setShowPopup(false)}
          deleteTodo={props.deleteTodo}
          setTodos={props.setTodos}
        />
      )}

      {showColorPicker && (
        <div className="color-picker">
          {colors.map((color) => (
            <div
              key={color}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};
