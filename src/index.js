import React from "react";
import ReactDOM from "react-dom";
import { configureStore } from "./store/configureStore";
import "../node_modules/bulma/css/bulma.css";
import "./styles/margin-padding-helpers.css";
import App from "./App";

/* Do not use service worker for now */
// import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

ReactDOM.render(<App store={store} />, document.getElementById("root"));

// registerServiceWorker();
