import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./pages/popup/popup";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Popup />
    </ThemeProvider>
  </React.StrictMode>
);
