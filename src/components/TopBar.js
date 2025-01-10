import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import Editor from "@monaco-editor/react";
import { getLogs, setLogCallback } from "../utils/logging";

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
}

// Add this component for consistent heading styling
function SectionHeading({ children }) {
  return (
    <Typography
      variant="h6"
      sx={{
        color: "text.secondary",
        fontSize: "0.875rem",
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

// Add a component to display parameter definitions
function ParamDefinitions({ params }) {
  return (
    <Box sx={{ mb: 2, fontSize: "0.875rem" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Parameter Definitions:
      </Typography>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {Object.entries(params).map(([name, param]) => (
          <Box
            key={name}
            sx={{
              p: 1,
              borderBottom: 1,
              borderColor: "divider",
              "&:last-child": { borderBottom: 0 },
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                component="span"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {name}
              </Typography>
              <Typography
                component="span"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8125rem",
                  fontFamily: "monospace",
                }}
              >
                {param.type}
              </Typography>
              {param.required && (
                <Typography
                  component="span"
                  sx={{ color: "error.main", fontSize: "0.75rem" }}
                >
                  (required)
                </Typography>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {param.description}
            </Typography>
            {param.default !== undefined && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                  fontFamily: "monospace",
                  fontSize: "0.8125rem",
                }}
              >
                Default: {JSON.stringify(param.default)}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function TopBar({
  worlds,
  selectedWorld,
  onWorldChange,
  darkMode,
  onToggleDarkMode,
}) {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [actionResponse, setActionResponse] = useState(null);
  const [actionPayload, setActionPayload] = useState("{}");
  const [currentTab, setCurrentTab] = useState(0);
  const [logs, setLogs] = useState([]);
  const [nodeState, setNodeState] = useState("");
  const [stateError, setStateError] = useState(false);
  const [payloadError, setPayloadError] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showParams, setShowParams] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setNodeState(JSON.stringify(selectedNode.getState(), null, 2));
    }
  }, [selectedNode?.getState()]);

  useEffect(() => {
    setLogs(getLogs());
    setLogCallback((newLog, clear) => {
      if (clear) {
        setLogs([]);
      } else if (newLog) {
        setLogs((prev) => [newLog, ...prev]);
      }
    });
  }, []);

  const systems = Array.from(selectedWorld.systems.values());
  const nodes = selectedSystem ? Array.from(selectedSystem.nodes.values()) : [];
  const actions = selectedNode ? Array.from(selectedNode.actions.keys()) : [];

  const handleWorldChange = (event) => {
    const world = worlds.find((w) => w.name === event.target.value);
    onWorldChange(world);
    setSelectedSystem(null);
    setSelectedNode(null);
    setActionResponse(null);
  };

  const handleSystemChange = (event) => {
    const system = selectedWorld.systems.get(event.target.value);
    setSelectedSystem(system);
    setSelectedNode(null);
    setActionResponse(null);
  };

  const handleNodeChange = (event) => {
    const node = selectedSystem.nodes.get(event.target.value);
    setSelectedNode(node);
    setActionResponse(null);
  };

  const validateJson = (value, setError) => {
    try {
      JSON.parse(value);
      setError(false);
      return true;
    } catch (error) {
      setError(true);
      return false;
    }
  };

  const handlePayloadChange = (value) => {
    setActionPayload(value);
    validateJson(value, setPayloadError);
  };

  const handleStateChange = (value) => {
    setNodeState(value);
    validateJson(value, setStateError);
  };

  const handleAction = (actionType) => {
    try {
      if (!validateJson(actionPayload, setPayloadError)) {
        setActionResponse({
          message: "Invalid payload JSON",
          severity: "error",
        });
        return;
      }

      const result = selectedWorld.runAction(
        selectedSystem.name,
        selectedNode.name,
        actionType,
        JSON.parse(actionPayload)
      );
      setActionResponse({ message: result.response, severity: "success" });

      // State will be automatically updated via the useEffect
    } catch (error) {
      setActionResponse({ message: error.message, severity: "error" });
    }
  };

  const handleCopyJson = (json) => {
    navigator.clipboard.writeText(json);
    setActionResponse({ message: "Copied to clipboard", severity: "success" });
  };

  const handleSaveState = () => {
    try {
      const newState = JSON.parse(nodeState);
      console.log("Parsed state:", newState); // Debug log
      selectedNode.setState(newState);
      setActionResponse({
        message: "State updated successfully",
        severity: "success",
      });
      setStateError(false);
    } catch (error) {
      console.error("Save state error:", error); // Debug log
      setActionResponse({
        message: `Invalid JSON format: ${error.message}`,
        severity: "error",
      });
      setStateError(true);
    }
  };

  const handleActionSelect = (actionType) => {
    const action = selectedNode.actions.get(actionType);
    console.log("Selected action:", action);
    if (action) {
      setSelectedAction(action);
      try {
        const defaultPayload = action.getDefaultPayload();
        console.log("Default payload:", defaultPayload);
        setActionPayload(JSON.stringify(defaultPayload, null, 2));
      } catch (error) {
        console.error("Error getting default payload:", error);
      }
    }
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <CodeIcon sx={{ mr: 2, color: "primary.main" }} />
          <Box sx={{ display: "flex", gap: 2, flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SectionHeading>World:</SectionHeading>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={selectedWorld?.name || ""}
                  onChange={handleWorldChange}
                >
                  {worlds.map((world) => (
                    <MenuItem key={world.name} value={world.name}>
                      {world.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SectionHeading>System:</SectionHeading>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={selectedSystem?.name || ""}
                  onChange={handleSystemChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {systems.map((system) => (
                    <MenuItem key={system.name} value={system.name}>
                      {system.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SectionHeading>Node:</SectionHeading>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={selectedNode?.name || ""}
                  onChange={handleNodeChange}
                  disabled={!selectedSystem}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {nodes.map((node) => (
                    <MenuItem key={node.name} value={node.name}>
                      {node.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <IconButton onClick={onToggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>

        {selectedNode && (
          <>
            <Box sx={{ px: 2, py: 1, bgcolor: "background.default" }}>
              <Typography variant="body2" color="text.secondary">
                {selectedWorld.name} / {selectedSystem.name} /{" "}
                {selectedNode.name}
              </Typography>
            </Box>
            <Tabs
              value={currentTab}
              onChange={(_, newValue) => setCurrentTab(newValue)}
              sx={{ px: 2 }}
            >
              <Tab label="REQUEST/RESPONSE" />
              <Tab label="LOGS" />
            </Tabs>
          </>
        )}
      </AppBar>

      {selectedNode && (
        <>
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    borderColor: payloadError ? "error.main" : undefined,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Available Actions
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      gap: 2,
                    }}
                  >
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <InputLabel>Select Action</InputLabel>
                      <Select
                        value={selectedAction?.getName() || ""}
                        label="Select Action"
                        onChange={(e) => handleActionSelect(e.target.value)}
                      >
                        {actions.map((actionType) => (
                          <MenuItem key={actionType} value={actionType}>
                            {actionType}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {selectedAction && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAction(selectedAction.getName())}
                        disabled={payloadError}
                      >
                        Execute
                      </Button>
                    )}
                  </Box>
                  {selectedAction && (
                    <>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                          Payload
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => setShowParams(!showParams)}
                          sx={{ mr: 1 }}
                        >
                          {showParams ? "Hide Params" : "Show Params"}
                        </Button>
                        {payloadError && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mr: 1 }}
                          >
                            Invalid JSON
                          </Typography>
                        )}
                        <Tooltip title="Copy JSON">
                          <IconButton
                            size="small"
                            onClick={() => handleCopyJson(actionPayload)}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {showParams && (
                        <ParamDefinitions params={selectedAction.getParams()} />
                      )}
                      <Box sx={{ height: "400px" }}>
                        <Editor
                          defaultLanguage="json"
                          value={actionPayload}
                          onChange={handlePayloadChange}
                          theme={darkMode ? "vs-dark" : "vs-light"}
                          options={{
                            minimap: { enabled: false },
                            formatOnPaste: true,
                            formatOnType: true,
                          }}
                        />
                      </Box>
                    </>
                  )}
                </Paper>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderColor: stateError ? "error.main" : undefined,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      Node State
                    </Typography>
                    {stateError && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mr: 1 }}
                      >
                        Invalid JSON
                      </Typography>
                    )}
                    <Tooltip title="Copy JSON">
                      <IconButton
                        size="small"
                        onClick={() => handleCopyJson(nodeState)}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save Changes">
                      <IconButton
                        size="small"
                        onClick={handleSaveState}
                        color={stateError ? "error" : "default"}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ height: "500px" }}>
                    <Editor
                      defaultLanguage="json"
                      value={nodeState}
                      onChange={handleStateChange}
                      theme={darkMode ? "vs-dark" : "vs-light"}
                      options={{
                        minimap: { enabled: false },
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Logs
              </Typography>
              <Box
                sx={{
                  maxHeight: "500px",
                  overflow: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                }}
              >
                {logs.map((log) => (
                  <Box
                    key={log.id}
                    sx={{
                      p: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:last-child": { borderBottom: 0 },
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                        fontFamily: "monospace",
                        width: "80px",
                      }}
                    >
                      {log.id}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                        fontFamily: "monospace",
                        width: "200px",
                      }}
                    >
                      {new Date(log.timestamp).toLocaleString()}
                    </Typography>
                    <Typography
                      sx={{
                        color:
                          log.level === "error"
                            ? "error.main"
                            : log.level === "warning"
                            ? "warning.main"
                            : "text.primary",
                        flexGrow: 1,
                        fontFamily: "monospace",
                      }}
                    >
                      {log.message}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </TabPanel>
        </>
      )}

      <Snackbar
        open={!!actionResponse}
        autoHideDuration={6000}
        onClose={() => setActionResponse(null)}
      >
        {actionResponse && (
          <Alert severity={actionResponse.severity}>
            {actionResponse.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
