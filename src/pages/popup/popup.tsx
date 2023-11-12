import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Button, Container, Paper, Stack, Zoom } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from 'react';
import { FormFields, MessagePayload } from '../../schemas';
import "./Popup.css";

export default function() {
  const [formData, setFormData] = useState<FormFields>({
    jellyseerrAddress: '',
    jellyseerrKey: '',
  });
  const [errors, setErrors] = useState<FormFields>({});
  const [connectSuccessful, setConnectSuccessful] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.sendMessage({type: "get_connection"}, (response: MessagePayload) => {
      const validationErrors: FormFields = response.body;
      if (validationErrors === undefined || validationErrors === null) {
        return;
      }
      setFormData(validationErrors);
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
    if (!isValidUrl(formData?.jellyseerrAddress || '')) {
      validationErrors.jellyseerrAddress = 'Jellyseerr address is invalid';
    }
    if (formData?.jellyseerrKey?.length === 0) {
      validationErrors.jellyseerrKey = 'Empty Jellyseerr API key';
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      fetch(`${formData.jellyseerrAddress}/api/v1/status`, {
        method: 'GET',
        headers: {
          'X-Api-Key': `${formData.jellyseerrKey}`,
          'Accept': 'application/json, text/plain, */*',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'same-origin'
        }
      })
      .then((response) => {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          validationErrors.jellyseerrAddress = 'Jellyseerr address is invalid';
          setConnectSuccessful(false);
          setErrors(validationErrors);
        } else {
          console.log("Connection successful");
          setConnectSuccessful(true);
          setErrors({});
        }
      }).catch((err) => {
        console.log('Fetch Error :-S', err);
        validationErrors.jellyseerrAddress = 'Jellyseerr address is invalid';
        setConnectSuccessful(false);
        setErrors(validationErrors);
      });
      chrome.runtime.sendMessage({type: "set_connection", body: formData}, (response: MessagePayload) => {
        console.log(response);
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
  }

  const icon = (
      <CheckCircleOutlineIcon color="success"/>
  );

  return (
    <Box
    component="form"
    autoComplete="off"
    sx={{ width: '100%' }}
    onSubmit={handleSave}
  >
    <div>
      <TextField
        name="jellyseerrAddress"
        label="Jellyseerr Address"
        margin="normal"
        fullWidth={true}
        variant="outlined"
        error={Boolean(errors.jellyseerrAddress)}
        helperText={errors.jellyseerrAddress || ''}
        value={formData.jellyseerrAddress || ''}
        onChange={handleChange}
      />
      <TextField
        name="jellyseerrKey"
        label="Jellyseerr API Key"
        variant="outlined"
        margin="normal"
        fullWidth={true}
        error={Boolean(errors.jellyseerrKey)}
        helperText={errors.jellyseerrKey || ''}
        value={formData.jellyseerrKey || ''}
        onChange={handleChange}
      />
      <Stack 
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Button 
          variant="contained"
          type="submit"
        >
          Save
        </Button>
        <Zoom className="check-button" in={connectSuccessful}>{icon}</Zoom>
      </Stack>
    </div>
  </Box>
  );
}
