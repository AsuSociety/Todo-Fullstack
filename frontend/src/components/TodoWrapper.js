// TodoWrapper.js

// Import React and useState hook
import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";

export const TodoWrapper = () => {
  // Retrieve tasks from local storage or use an empty array if there are none
  const initialTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const [todos, setTodos] = useState(initialTodos);

  // State to keep track of the next ID for new todos
  const [nextId, setNextId] = useState(
    Math.max(...initialTodos.map((todo) => todo.id), 0) + 1
  );

  // Function to generate a unique ID for a new todo
  const generateId = () => {
    const id = nextId;
    setNextId((prevId) => prevId + 1);
    console.log(id);
    return id;
  };

  // Function to add a new todo to the list
  const addTodo = (todo) => {
    const newTodo = {
      id: generateId(),
      task: todo,
      completed: false,
      isEditing: false,
    };
    setTodos([...todos, newTodo]);
    saveToLocalStorage([...todos, newTodo]);
  };

  // Function to delete a todo from the list
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    if (updatedTodos.length === 0) {
      // If all tasks are deleted, reset nextId to 1
      setNextId(1);
    } else {
      // If not all tasks are deleted, find the maximum ID
      const maxId = Math.max(...updatedTodos.map((todo) => todo.id));

      // Update nextId to the maximum ID + 1
      setNextId(maxId + 1);
    }

    saveToLocalStorage(updatedTodos);
  };

  // Function to toggle the completion status of a todo
  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos);
  };

  // Function to toggle the editing status of a todo
  const editTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
    );
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos);
  };

  // Function to edit the task of a todo
  const editTask = (task, id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
    );
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos);
  };

  // Function to save todos to local storage
  const saveToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  // Cleanup local storage and re-save todos when the component unmounts
  useEffect(() => {
    return () => localStorage.removeItem("todos");
  }, []);

  // Return the main component JSX with the to-do list
  return (
    <div className="TodoWrapper">
      <h1>My To-Do List!</h1>
      {/* Render the form to add new todos */}
      <TodoForm addTodo={addTodo} />
      {/* Display todos based on editing status */}
      {todos.map((todo) =>
        todo.isEditing ? (
          // Render the edit form if the todo is being edited
          <EditTodoForm key={todo.id} editTodo={editTask} task={todo} />
        ) : (
          // Render the Todo component for displaying and managing individual todos
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
