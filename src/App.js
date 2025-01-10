import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { TopBar } from "./components/TopBar";
import { exampleWorld } from "./worlds/example";
import { gameWorld } from "./worlds/game";

// In a real app, you'd import multiple worlds
const worlds = [exampleWorld, gameWorld];

function App() {
  const [darkMode, setDarkMode] = useState(false);
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
