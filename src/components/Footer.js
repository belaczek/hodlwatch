import React from "react";
import { appName } from "../constants";

export default () => (
  <footer className="footer">
    <div className="container">
      <div className="content has-text-centered">
        <p>
          <strong>{appName}</strong> by{" "}
          <a href="https://tomasbelada.com">Tomas Belada</a>. The source code is
          licensed{" "}
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
        </p>
      </div>
    </div>
  </footer>
);
