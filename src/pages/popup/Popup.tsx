import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import logo from "@assets/img/logo.svg";
import { Button } from "@mui/material";

interface FormFields {
  jellyseerrAddress?: string,
  jellyseerrKey?: string,
}


export default function Popup(): JSX.Element {
  const [formData, setFormData] = React.useState<FormFields>({
    jellyseerrAddress: '',
    jellyseerrKey: ''
  });

  const [errors, setErrors] = React.useState<FormFields>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    // Validation rules
    const validationErrors: FormFields = {};

    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
    console.log(formData?.jellyseerrAddress)
    console.log(urlRegex.test(formData?.jellyseerrAddress || ''))
    if (!urlRegex.test(formData?.jellyseerrAddress || '')) {
      validationErrors.jellyseerrAddress = 'Jellyseerr address is invalid';
    }
    if (formData?.jellyseerrKey?.length === 0) {
      validationErrors.jellyseerrKey = 'Empty Jellyseerr API key';
    }

    setErrors(validationErrors);

    // If there are no validation errors, submit the form
    if (Object.keys(validationErrors).length === 0) {
      // Your form submission logic here
      console.log('Form submitted with data:', formData);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      autoComplete="off"
      onSubmit={handleSave}
    >
      <div>
        <TextField
          name="jellyseerrAddress"
          label="Jellyseerr Address"
          margin="normal"
          variant="outlined"
          error={Boolean(errors.jellyseerrAddress)}
          helperText={errors.jellyseerrAddress || ''}
          value={formData.jellyseerrAddress}
          onChange={handleChange}
        />
        <TextField
          name="jellyseerrKey"
          label="Jellyseerr API Key"
          variant="outlined"
          margin="normal"
          error={Boolean(errors.jellyseerrKey)}
          helperText={errors.jellyseerrKey || ''}
          value={formData.jellyseerrKey}
          onChange={handleChange}
        />
        <Button 
          variant="contained"
          type="submit"
        >
          Save
        </Button>
      </div>
    </Box>
  );
}
