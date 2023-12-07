import { TextField, Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import Adb from "@devicefarmer/adbkit";

import SearchIcon from "@mui/icons-material/Search";
import { EventEmitter } from "stream";

let content = "";

export default function FormLogs({ log }: { log(content: string): void }) {
  const [tag, setTag] = useState("Neil");

  useEffect(() => {
    const client = Adb.createClient();
    const subscribeToLogcat = async () => {
      try {
        const device = await client.getDevice("emulator-5554");
        device.openLogcat({ clear: true }).then((logcat: EventEmitter) => {
          logcat.on("entry", (entry) => {
            if (entry.tag === tag) {
              log((content += entry.message + "\n"));
            }
          });
        });
      } catch (err) {
        console.error("Something went wrong:", err);
      }
    };
    log("");
    subscribeToLogcat();
  }, [tag]);

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // content = "";
    // logcat?.removeAllListeners;
    setTag(event.target.value); // Actualiza el estado con la nueva etiqueta
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    content = "";
    log("")
    // logcat?.removeAllListeners;
    setTag(tag);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" spacing={2}>
        <TextField
          id="outlined-basic"
          label="Filtro"
          variant="outlined"
          value={tag}
          onChange={handleTagChange}
        />
        <Button variant="outlined" type="submit" startIcon={<SearchIcon />}>
          Filtrar
        </Button>
      </Stack>
    </form>
  );
}

// No es necesario realizar ninguna acción aquí, ya que los registros se están leyendo en useEffect

// const client = Adb.createClient();
// const test = async () => {
//     try {
//         const tracker = await client.trackDevices();
//         tracker.on('add', (device: { id: any; }) => console.log('Device %s was plugged in', device.id));
//         tracker.on('remove', (device: { id: any; }) => console.log('Device %s was unplugged', device.id));
//         tracker.on('end', () => console.log('Tracking stopped'));
//     } catch (err) {
//         console.error('Something went wrong:', err);
//     }
// };
// await test()
