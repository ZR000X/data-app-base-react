import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CodeIcon from "@mui/icons-material/Code";

const TopBar = ({ darkMode, onToggleDarkMode }) => {
  return (
    <AppBar position="fixed" elevation={0} color="inherit">
      <Toolbar>
        <CodeIcon sx={{ mr: 2, color: "primary.main" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Condorgreen Beyond Mobile JSON State Machine (Data Design Devtool)
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={onToggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
