// App.js
import React from "react";
import { TodoWrapper } from "./components/Todos/TodoWrapper";
import { CompanyRegister } from "./components/Register/CompanyRegister";
import { Company } from "./components/Register/Company";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import AuthService from "./components/AuthService";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={AuthService.getToken() ? "/todos" : "/login"} />,
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
  {
    path: "/companyregister",
    element: <CompanyRegister />,
  },
  {
    path: "/company",
    element: <Company />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
