import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "../theme";
import Form from "./form/FormLog";
import LogContainer from "./log/container/LogContainer";

export default function App(): JSX.Element {
  const [content, setContent] = useState( Array<{ priority: number, message: string }>);

  const addLog = (
    newLogs: Array<{ priority: number, message: string }>
  ) => {
    setContent(prevContent => [...prevContent, ...newLogs]);
  };

  const cleanLog = () => {
    setContent([]);
  };

  const { ipcRenderer } = window.require("electron");
  const [appVersion, setAppVersion] = useState("");

  useEffect(() => {
    ipcRenderer.invoke("get-app-version").then((version) => {
      setAppVersion(version);
    });
  }, []);

  const name = "Gutenberg";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <main>
          {
            <Container maxWidth="sm">
              <Typography variant="h2" align="center">
                {name}
              </Typography>
              <Typography variant="h6" align="center">
                {appVersion}
              </Typography>
              <Form log={addLog} />
              <LogContainer content={content} cleanLog={cleanLog}/>
            </Container>
          }
        </main>
      </Box>
    </ThemeProvider>
  );
}
