import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Adb, { Device } from "@devicefarmer/adbkit";

import SearchIcon from "@mui/icons-material/Search";
import { EventEmitter } from "stream";

let content = "";

export default function FormLogs({ log }: { log(content: string): void }) {
  const [tag, setTag] = useState("Neil");
  const [device, setDevice] = useState("");
  const [deviceList, setDeviceList] = useState(["Oliver Hansen"]); // Ahora names es un estado

  const handleChange = (event: SelectChangeEvent) => {
    setDevice(event.target.value as string);
  };

  useEffect(() => {
    const client = Adb.createClient();

    const subscribeToLogcat = async () => {
      try {
        const deviceChose = await client.getDevice(device);
        deviceChose.openLogcat({ clear: true }).then((logcat: EventEmitter) => {
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
  }, [tag, device]);

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value); // Actualiza el estado con la nueva etiqueta
  };

  const listarDevices = () => {
    const client = Adb.createClient();
    const listClient = async () => {
      try {
        client.listDevices().then((devices: Device[]) => {
          const deviceNames = devices.map((device) => device.id); // Crea un array con los nombres de los dispositivos
          setDeviceList(deviceNames); // Actualiza el estado names
        });
      } catch (err) {
        console.error("Something went wrong:", err);
      }
    };
    listClient();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    content = "";
    log("");
    setTag(tag);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Devices</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={device}
            label="Device"
            onChange={handleChange}
          >
            {deviceList.map((device) => {
              return (
                <MenuItem key={device} value={device}>
                  {device}
                </MenuItem>
              );
            })}
          </Select>
          <Button
            variant="outlined"
            onClick={listarDevices}
            startIcon={<SearchIcon />}
          >
            Listar devices
          </Button>
        </FormControl>
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
