import { Box, Typography, Paper } from "@mui/material";
import Editor from "@monaco-editor/react";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useMonacoTheme } from "../hooks/useMonacoTheme";

const ResponseSection = ({ response }) => {
  const monacoTheme = useMonacoTheme();
  const hasError = response?.error;
  const responseString = response ? JSON.stringify(response, null, 2) : "";

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Response
        </Typography>
        {response && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: hasError ? "error.main" : "success.main",
            }}
          >
            {hasError ? <ErrorOutlineIcon /> : <DoneIcon />}
          </Box>
        )}
      </Box>

      <Paper
        variant="outlined"
        sx={{
          bgcolor: "background.default",
          borderColor: hasError ? "error.main" : "divider",
        }}
      >
        <Editor
          height="200px"
          defaultLanguage="json"
          value={responseString || "// Waiting for response..."}
          theme={monacoTheme}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            lineNumbers: "off",
            folding: false,
            domReadOnly: true,
            contextmenu: false,
          }}
        />
      </Paper>
    </Box>
  );
};

export default ResponseSection;
