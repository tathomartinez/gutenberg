import React, { useState, useEffect } from "react";
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Adb, { Device } from "@devicefarmer/adbkit"; // Asume que adb es importado correctamente
import EventEmitter from "events";

export default function FormLogs({
  log,
}: {
  log(logs: Array<{ priority: number; message: string }>): void;
}) {
  const [tag, setTag] = useState("Neil");
  const [device, setDevice] = useState("");
  const [deviceList, setDeviceList] = useState([""]);
  const isPriorityValidate = (priority: number) => {
    priority == 6
    return false}

  const handleChange = (event: SelectChangeEvent<string>) => {
    setDevice(event.target.value as string);
  };

  useEffect(() => {
    const client = Adb.createClient();

    const subscribeToLogcat = async () => {
      try {
        const deviceChose = await client.getDevice(device);
        deviceChose.openLogcat({ clear: true }).then((logcat: EventEmitter) => {
          logcat.on("entry", (entry) => {
            const newLog = { priority: entry.priority, message: entry.message };
            if (isPriorityValidate(entry.priority) || !tag || entry.tag === tag) {
              log([newLog]);
            }
          });
        });
      } catch (err) {
        console.error("Something went wrong:", err);
      }
    };
    log([]);
    subscribeToLogcat();
  }, [tag, device]);

  

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value);
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
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    log([]);
    setTag(tag);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="column" spacing={2}>
        <FormControl fullWidth>
          <Button
            variant="outlined"
            onClick={listarDevices}
            startIcon={<SearchIcon />}
          >
            Listar devices
          </Button>
          <InputLabel id="demo-simple-select-label">Devices</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={device}
            label="Device"
            placeholder="Select a device"
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