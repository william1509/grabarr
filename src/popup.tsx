import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./pages/popup/popup";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material";
import { deepOrange, lightBlue } from "@mui/material/colors";
import theme from "./theme";

ReactDOM.createRoot(document.body).render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  </ThemeProvider>
);
