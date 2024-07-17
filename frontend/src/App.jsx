// App.js

// Import necessary modules and components
import React from "react"; // Import React and useState hook for state management
import { TodoWrapper } from "./components/Todos/TodoWrapper"; // Import TodoWrapper component
import { Task } from "./components/Todos/Task"; // Import Task component for displaying Tasks
import { Login } from "./components/Login/Login"; // Import Login component for user login
import { Register } from "./components/Register/Register"; // Import Register component for user registration
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
// import CalendarView from "./components/Todos/CalendarView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/todos",
    element: <TodoWrapper />,
  },
  // {
  //   path: "/calendarview",
  //   element: <CalendarView />,
  // },
]);

// Define App function component
function App() {
  return <RouterProvider router={router} />;
}

export default App; // Export App component as the default export
