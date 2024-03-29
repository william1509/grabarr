import { ThemeOptions, createTheme } from "@mui/material";
import { deepOrange, lightBlue } from "@mui/material/colors";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: deepOrange,
    background: {
      default: "#333333",
      paper: "#EEEEEE",
    },
  },
  typography: {
    body2: {
      color: "white",
    },
    subtitle1: {
      color: "white",
    },
    caption: {
      color: "white",
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "2em",
          color: "yellow",
          backgroundColor: "red",
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
