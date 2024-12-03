import React from "react";
import "./AppNotification.css";

function AppNotification({ type, text }) {
  return (
    <div className="container">
      <h3 className="h3">{text}</h3>
    </div>
  );
}

export default AppNotification;
