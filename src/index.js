import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AuthProvider from "./context/AuthContext";
import QuestionProvider from "./context/QuestionContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <QuestionProvider>
        <App />
      </QuestionProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
