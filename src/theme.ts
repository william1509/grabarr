import { ThemeOptions, createTheme } from '@mui/material';
import { deepOrange, lightBlue } from "@mui/material/colors";

const themeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#2196f3',
        },
        secondary: deepOrange,
        background: {
            default: '#333333',
            paper: '#555555',
        },
    },
    typography: {
        body1: {
            color: 'white',
        },
    },
    components: {
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              fontSize: "2em",
              color: "yellow",
              backgroundColor: "red"
            }
          }
        }
      }
}

const theme = createTheme(themeOptions);

export default theme;