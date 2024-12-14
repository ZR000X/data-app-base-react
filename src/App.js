import {
  Container,
  Paper,
  Grid,
  ThemeProvider,
  CssBaseline,
  Box,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { getTheme } from "./theme";
import TopBar from "./components/TopBar";
import RequestSection from "./components/RequestSection";
import ResponseSection from "./components/ResponseSection";
import StateSection from "./components/StateSection";
import LogsSection from "./components/LogsSection";
import { handleAction } from "./actions";
import { log, setLogCallback, clearLogs, getLogs } from "./utils/logging";

class AppState {
  constructor() {
    this.currentRequest = null;
    this.lastResponse = null;
    this.logs = [];
  }
}

function App() {
  const [state, setState] = useState(new AppState());
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(
    () => getTheme(darkMode ? "dark" : "light"),
    [darkMode]
  );

  useEffect(() => {
    // Register the log callback when component mounts
    setLogCallback((logEntry, clear) => {
      if (clear) {
        setState((prev) => ({
          ...prev,
          logs: [],
        }));
      } else if (logEntry) {
        setState((prev) => ({
          ...prev,
          logs: [...prev.logs, logEntry],
        }));
      }
    });
  }, []);

  const handleRequest = async (requestData) => {
    log(`Received request: ${requestData.action}`);

    try {
      const {
        response,
        newState,
        log: actionLog,
      } = handleAction(requestData.action, requestData.params, state);

      setState((prev) => ({
        ...newState,
        logs: prev.logs,
        lastResponse: response,
      }));

      if (actionLog) {
        log(actionLog);
      }
    } catch (error) {
      log(`Error: ${error.message}`, "error");
    }
  };

  const handleStateChange = (newState) => {
    log("State manually changed");
    setState((prev) => ({
      ...newState,
      logs: prev.logs,
    }));
  };

  const handleClearLogs = () => {
    clearLogs();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          pt: "64px",
        }}
      >
        <TopBar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <RequestSection onRequest={handleRequest} />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ResponseSection response={state.lastResponse} />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <LogsSection
                      logs={state.logs}
                      onClearLogs={handleClearLogs}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "calc(100vh - 96px)",
                  position: "sticky",
                  top: "80px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <StateSection state={state} onChange={handleStateChange} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
