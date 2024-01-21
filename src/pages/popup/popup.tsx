import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button, Container, Paper, Stack, Typography, Zoom } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import "./Popup.css";
import { FormFields, MessagePayload, MessageStatus } from "../../types";
import CustomizedMenus from "../../components/styled-menu/styled-menu";

export default function () {
  const [formData, setFormData] = useState<FormFields>({
    jellyseerrAddress: "",
    jellyseerrKey: "",
  });
  const [errors, setErrors] = useState<FormFields>({});
  const [connectSuccessful, setConnectSuccessful] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "get_connection" }, (response: MessagePayload) => {
      const connection: FormFields = response.body;
      if (connection === undefined || connection === null) {
        return;
      }
      setFormData(connection);
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const validationErrors: FormFields = {};
    if (!isValidUrl(formData?.jellyseerrAddress || "")) {
      validationErrors.jellyseerrAddress = "Jellyseerr address is invalid";
    }
    if (formData?.jellyseerrKey?.length === 0) {
      validationErrors.jellyseerrKey = "Empty Jellyseerr API key";
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      chrome.runtime.sendMessage({ type: "set_connection", body: formData }, (response: MessagePayload) => {
        switch (response.status) {
          case MessageStatus.OK:
            setConnectSuccessful(true);
            setErrors({});
            setTimeout(() => {
              setConnectSuccessful(false);
            }, 5000);
            break;
          case MessageStatus.ERROR:
            errors.jellyseerrAddress = "Jellyseerr address is invalid";
            setConnectSuccessful(false);
            setErrors(errors);
            break;
          default:
            break;
        }
      });
    }
  };

  const isValidUrl = (string: string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return true;
  };

  const icon = <CheckCircleOutlineIcon color="success" />;

  return (
    <Box component="form" autoComplete="off" sx={{ width: "100%" }} onSubmit={handleSave}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Grabarr</Typography>
        <CustomizedMenus />
      </div>

      <div>
        <TextField
          name="jellyseerrAddress"
          label="Jellyseerr Address"
          margin="normal"
          fullWidth={true}
          color="primary"
          error={Boolean(errors.jellyseerrAddress)}
          helperText={errors.jellyseerrAddress || ""}
          value={formData.jellyseerrAddress || ""}
          onChange={handleChange}
        />
        <TextField
          name="jellyseerrKey"
          label="Jellyseerr API Key"
          margin="normal"
          color="primary"
          fullWidth={true}
          error={Boolean(errors.jellyseerrKey)}
          helperText={errors.jellyseerrKey || ""}
          value={formData.jellyseerrKey || ""}
          onChange={handleChange}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Button variant="contained" type="submit">
            Save
          </Button>
          {connectSuccessful && (
            <Button>
                {icon}
            </Button>
          )}
        </Stack>
      </div>
    </Box>
  );
}
