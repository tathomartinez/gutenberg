import React from "react";
import { Stack } from "@mui/material";

export default function LogSpam({ logs }: { logs: Array<{ priority: number, message: string }> }) {

  // Función para determinar el color según la prioridad
  const getColor = (priority:number) => {
    switch (priority) {
      case 6: return 'red';      // Color rojo para priority 2
      default: return 'white';   // Color predeterminado para otras prioridades
    }
  };

  return (
    <Stack spacing={1}>
      {logs.map((log, index) => (
        <span key={index} style={{ color: getColor(log.priority) }}>
          {log.message}
        </span>
      ))}
    </Stack>
  );
}