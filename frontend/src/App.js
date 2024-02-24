// App.js

// Import necessary modules and components
import React, { useState } from "react"; // Import React and useState hook for state management
import "./App.css"; // Import CSS file for styling
import { TodoWrapper } from "./components/TodoWrapper"; // Import TodoWrapper component
import { UserProvider } from "./components/UserContext"; // Import UserProvider component for user context
import Modal from "./components/Modal"; // Import Modal component for displaying modals
import { Login } from "./components/Login/Login"; // Import Login component for user login
import { Register } from "./components/Register/Register"; // Import Register component for user registration

// Define App function component
function App() {
  // State management with useState hook
  const [currentStep, setCurrentStep] = useState("Login"); // Initialize state variable 'currentStep' with default value "Login"

  // Event handlers
  const openModal = () => {
    setCurrentStep("Login"); // Update currentStep state to "Login" to open the login modal
  };

  const closeModal = () => {
    setCurrentStep("TodoWrapper"); // Update currentStep state to "TodoWrapper" to close the modal and show the main TodoWrapper component
  };

  const handleLogin = () => {
    setCurrentStep("Login"); // Handle login action by updating currentStep state to "Login"
  };

  const handleRegister = () => {
    setCurrentStep("Register"); // Handle register action by updating currentStep state to "Register"
  };

  // JSX structure returned by the App component
  return (
    <div className="App">
      <UserProvider>
        {" "}
        {/* UserProvider wraps the entire application, providing user context */}
        {currentStep !== "TodoWrapper" && ( // Conditional rendering based on currentStep state
          <Modal onClose={closeModal}>
            {" "}
            {/* Render modal component */}
            {currentStep === "Login" && ( // Conditionally render Login component if currentStep is "Login"
              <Login onLogin={handleLogin} onRegister={handleRegister} />
            )}
            {currentStep === "Register" && ( // Conditionally render Register component if currentStep is "Register"
              <Register
                onRegister={handleRegister}
                onBackToLogin={handleLogin}
              />
            )}
          </Modal>
        )}
        {currentStep === "TodoWrapper" && ( // Render TodoWrapper component if currentStep is "TodoWrapper"
          <TodoWrapper openModal={openModal} handleLogin={handleLogin} />
        )}
      </UserProvider>
    </div>
  );
}

export default App; // Export App component as the default export
