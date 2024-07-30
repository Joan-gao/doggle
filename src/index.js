import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import GlobalProvider from "./context/GlobalProvider";
ReactDOM.render(
  // <GlobalProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </GlobalProvider>,
  document.getElementById("root")
);
