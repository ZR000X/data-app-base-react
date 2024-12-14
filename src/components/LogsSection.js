import { Box, Typography, Paper, IconButton, Tooltip } from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useState } from "react";

const LogsSection = ({ logs, onClearLogs }) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const reversedLogs = [...logs].reverse();

  const getLogColor = (message) => {
    if (message.toLowerCase().includes("error")) return "error.main";
    if (message.toLowerCase().includes("success")) return "success.main";
    return "text.primary";
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Logs
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Clear logs">
            <IconButton size="small" color="inherit" onClick={onClearLogs}>
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          maxHeight: "300px",
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{
            height: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            p: 2,
            fontFamily: "monospace",
            fontSize: "0.875rem",
          }}
        >
          {reversedLogs.map((log, index) => (
            <Box
              key={index}
              sx={{
                py: 0.5,
                display: "flex",
                alignItems: "flex-start",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  mr: 2,
                  whiteSpace: "nowrap",
                }}
              >
                {new Date(log.timestamp).toLocaleTimeString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: getLogColor(log.message),
                  wordBreak: "break-word",
                }}
              >
                {log.message}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default LogsSection;
