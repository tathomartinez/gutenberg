import React from "react";
import { Button, Stack } from "@mui/material";
import DownloadingIcon from "@mui/icons-material/Downloading";

import TrashIcon from "@mui/icons-material/TabletAndroidSharp";
import LogSpam from "./LogSpam";

export default function LogContainer({
  content,
}: {
  content: Array<{ priority: number; message: string }>;
  cleanLog(): void;
}) {
  
  const handleDownload = () => {
    const logString = content.map((log) => log.message).join("\n");
    const blob = new Blob([logString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "logcat.txt"; // Puedes personalizar el nombre del archivo aquí
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const logearContent = (
    content: Array<{ priority: number; message: string }>
  ) => {
    return content.slice(-10);
  };
  const handleClean = () => {
    cleanLog();
  };

  return (
    <Stack>
      <LogSpam logs={logearContent(content)}></LogSpam>
      <Button
        variant="outlined"
        onClick={handleDownload}
        startIcon={<DownloadingIcon />}
      >
        Descargar
      </Button>
      <Button
        variant="outlined"
        onClick={handleClean}
        startIcon={<TrashIcon />}
      >
        Clean
      </Button>
    </Stack>
  );
}
function cleanLog() {
  throw new Error("Function not implemented.");
}

