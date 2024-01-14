import React, { useState } from "react";
import "./App.css";
import { TodoWrapper } from "./components/TodoWrapper";
import { UserProvider } from "./components/UserContext";
import Modal from "./components/Modal";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";

function App() {
  const [currentStep, setCurrentStep] = useState("Login");

  const openModal = () => {
    // Implement your logic if needed
    setCurrentStep("Login");
  };

  const closeModal = () => {
    // Implement your logic if needed
    setCurrentStep("TodoWrapper");
  };

  const handleLogin = () => {
    console.log("Handling login...");
    setCurrentStep("Login");
  };

  const handleRegister = () => {
    setCurrentStep("Register");
  };

  return (
    <div className="App">
      <UserProvider>
        {currentStep !== "TodoWrapper" && (
          <Modal onClose={closeModal}>
            {currentStep === "Login" && (
              <Login onLogin={handleLogin} onRegister={handleRegister} />
            )}
            {currentStep === "Register" && (
              <Register
                onRegister={handleRegister}
                onBackToLogin={handleLogin}
              />
            )}
          </Modal>
        )}
        {currentStep === "TodoWrapper" && (
          <TodoWrapper openModal={openModal} handleLogin={handleLogin} />
        )}
      </UserProvider>
    </div>
  );
}

export default App;

//   return (
//     <div className="App">
//       <Router>
//         <UserProvider>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/" element={<TodoWrapper />} />
//           </Routes>
//         </UserProvider>
//       </Router>
//     </div>
//   );
// }

// <div className="App">
//   <UserProvider>
//     <TodoWrapper />
//   </UserProvider>
// </div>
