import { ThemeOptions, createTheme } from '@mui/material';
import { deepOrange, lightBlue } from "@mui/material/colors";

const themeOptions: ThemeOptions = {
    palette: {
        primary: lightBlue,
        secondary: deepOrange,
    },
}

export default createTheme(themeOptions);