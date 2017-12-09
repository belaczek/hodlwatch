import React from "react";
import { appName } from "../constants";

export default () => (
  <nav className="navbar">
    <div className="container">
      <div className="navbar-brand">
        <div className="navbar-item">
          <strong>{appName}</strong>
        </div>
      </div>
    </div>
  </nav>
);
