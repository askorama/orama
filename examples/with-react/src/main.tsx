import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "uno.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="flex w-full justify-center font-sans">
      <App />
    </div>
  </React.StrictMode>
);
