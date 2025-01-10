import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { TopBar } from "./components/TopBar";
import { exampleWorld } from "./worlds/example";

// In a real app, you'd import multiple worlds
const worlds = [exampleWorld];

function App() {
  // Initialize dark mode from localStorage, defaulting to false if not set
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Update localStorage when dark mode changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const [selectedWorld, setSelectedWorld] = useState(worlds[0]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <TopBar
          worlds={worlds}
          selectedWorld={selectedWorld}
          onWorldChange={setSelectedWorld}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
