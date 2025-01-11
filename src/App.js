import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { TopBar } from "./components/TopBar";
import { exampleWorld } from "./worlds/example";
import { IconButton, Tooltip } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";

// In a real app, you'd import multiple worlds
const worlds = [exampleWorld];

// Helper to get initial master state
const getInitialMasterState = () => {
  const saved = localStorage.getItem("masterState");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error parsing saved state:", error);
      return {};
    }
  }
  return {};
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [selectedWorld, setSelectedWorld] = useState(worlds[0]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [masterState, setMasterState] = useState(getInitialMasterState);
  const [filename, setFilename] = useState("app-state.json");

  // Update selected system and node when world changes
  const handleWorldChange = (world) => {
    setSelectedWorld(world);
    setSelectedSystem(null);
    setSelectedNode(null);
  };

  // Update selected node when system changes
  const handleSystemChange = (system) => {
    setSelectedSystem(system);
    setSelectedNode(null);
  };

  // Update selected node
  const handleNodeChange = (node) => {
    setSelectedNode(node);
  };

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Save master state whenever it changes
  useEffect(() => {
    localStorage.setItem("masterState", JSON.stringify(masterState));
  }, [masterState]);

  // Update master state when any node's state changes
  const handleNodeStateChange = (worldName, systemName, nodeName, newState) => {
    setMasterState((prev) => ({
      ...prev,
      [worldName]: {
        ...prev[worldName],
        [systemName]: {
          ...prev[worldName]?.[systemName],
          [nodeName]: newState,
        },
      },
    }));
  };

  // Load state for a specific node
  const getNodeState = (worldName, systemName, nodeName) => {
    const savedState = masterState[worldName]?.[systemName]?.[nodeName];

    // If no saved state exists, get the initial state from the node
    if (savedState === undefined) {
      const world = worlds.find((w) => w.name === worldName);
      const system = world?.systems.get(systemName);
      const node = system?.nodes.get(nodeName);

      if (node) {
        const initialState = node.getState();
        // Save the initial state
        handleNodeStateChange(worldName, systemName, nodeName, initialState);
        return initialState;
      }
    }

    return savedState;
  };

  // Handle state file upload
  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const newState = JSON.parse(text);

        // Set filename from uploaded file
        setFilename(file.name);

        // First update all nodes' states
        worlds.forEach((world) => {
          world.systems.forEach((system, systemName) => {
            system.nodes.forEach((node, nodeName) => {
              const savedState = newState[world.name]?.[systemName]?.[nodeName];
              if (savedState) {
                console.log(
                  `Updating state for ${world.name}/${systemName}/${nodeName}:`,
                  savedState
                );
                node.setState(savedState);
              }
            });
          });
        });

        // Then update master state
        console.log("Setting master state:", newState);
        setMasterState(newState);

        // Force a re-render of the current node if one is selected
        if (selectedWorld && selectedSystem && selectedNode) {
          const currentNodeState =
            newState[selectedWorld.name]?.[selectedSystem.name]?.[
              selectedNode.name
            ];
          if (currentNodeState) {
            selectedNode.setState(currentNodeState);
          }
        }
      } catch (error) {
        console.error("Error uploading state:", error);
      }
    }
    event.target.value = "";
  };

  // Handle state download
  const handleDownload = () => {
    const stateString = JSON.stringify(masterState, null, 2);
    const blob = new Blob([stateString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    // Clear localStorage
    localStorage.removeItem("masterState");

    // Reset master state
    setMasterState({});

    // Reset all nodes to their initial states
    worlds.forEach((world) => {
      world.systems.forEach((system) => {
        system.nodes.forEach((node) => {
          node.setState(node.getInitialState());
        });
      });
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Box
          sx={{
            height: "32px",
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            px: 2,
            gap: 1,
          }}
        >
          <input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            style={{
              border: "none",
              background: "none",
              flexGrow: 1,
              fontSize: "0.875rem",
              color: "inherit",
              outline: "none",
            }}
          />
          <Box sx={{ display: "flex", gap: 1 }}>
            <input
              type="file"
              id="state-upload"
              style={{ display: "none" }}
              accept="application/json"
              onChange={handleUpload}
            />
            <Tooltip title="Reset State">
              <IconButton size="small" color="primary" onClick={handleReset}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload State">
              <IconButton
                size="small"
                color="primary"
                onClick={() => document.getElementById("state-upload").click()}
              >
                <UploadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download State">
              <IconButton size="small" color="primary" onClick={handleDownload}>
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <TopBar
          worlds={worlds}
          selectedWorld={selectedWorld}
          onWorldChange={handleWorldChange}
          selectedSystem={selectedSystem}
          onSystemChange={handleSystemChange}
          selectedNode={selectedNode}
          onNodeChange={handleNodeChange}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onNodeStateChange={handleNodeStateChange}
          getNodeState={getNodeState}
          masterState={masterState}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
