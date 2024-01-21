import { useTheme } from "@emotion/react";
import { Paper, ThemeOptions, Typography } from "@mui/material";
import "./connection-error.css";
import React from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ConnectionError: React.FC<{}> = (props) => {
  const theme: ThemeOptions = useTheme();
  return (
    <Paper
      style={{
        padding: "10px",
        backgroundColor: theme.palette?.background?.paper,
        textAlign: "center"
      }}
    >
        <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
        }}>
        <ErrorOutlineIcon style={{color: "red"}}/>
        <Typography variant="body2" color={"black"}>Invalid connection information. Please set it correctly in the extension popup.</Typography>

        </div>
        <img src={chrome.runtime.getURL("ext_popup.png")}></img>
    </Paper>
  );
};

export default ConnectionError;
