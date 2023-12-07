import React from "react";
import { TextField, Button, Stack } from "@mui/material";
import DownloadingIcon from "@mui/icons-material/Downloading";

export default function LogContainer({ content }: { content: string }) {

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "logcat.txt"; // Puedes personalizar el nombre del archivo aquí
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Stack>
      <TextField
        id="outlined-multiline-flexible"
        label="LogCat"
        multiline
        rows={15}
        defaultValue="Default Value"
        value={content}
        fullWidth
        maxRows={Infinity}
      />
      <Button
        variant="outlined"
        onClick={handleDownload}
        startIcon={<DownloadingIcon />}
      >
        Descargar
      </Button>
    </Stack>
  );
}
