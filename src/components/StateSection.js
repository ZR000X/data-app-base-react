import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import RestoreIcon from "@mui/icons-material/Restore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SaveIcon from "@mui/icons-material/Save";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useMonacoTheme } from "../hooks/useMonacoTheme";

const StateSection = ({ state, onChange }) => {
  const monacoTheme = useMonacoTheme();
  const [pendingState, setPendingState] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [showCopied, setShowCopied] = useState(false);

  // Create a state object without logs, lastResponse, and currentRequest
  const displayState = { ...state };
  delete displayState.logs;
  delete displayState.lastResponse;
  delete displayState.currentRequest;

  // Update editor value when state changes
  useEffect(() => {
    setEditorValue(JSON.stringify(displayState, null, 2));
  }, [state]);

  const handleEditorChange = (value) => {
    try {
      const parsed = JSON.parse(value);
      setPendingState(parsed);
      setHasError(false);
    } catch (e) {
      setHasError(true);
    }
  };

  const handleSave = () => {
    if (pendingState && !hasError) {
      onChange(pendingState);
      setPendingState(null);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editorValue);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleReset = () => {
    setEditorValue(JSON.stringify(displayState, null, 2));
    setPendingState(null);
    setHasError(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          State
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Reset changes">
            <IconButton
              size="small"
              onClick={handleReset}
              disabled={!pendingState && !hasError}
            >
              <RestoreIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={showCopied ? "Copied!" : "Copy state"}>
            <IconButton size="small" onClick={handleCopy}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          bgcolor: "background.default",
          borderColor: hasError
            ? "error.main"
            : pendingState
            ? "warning.main"
            : "divider",
          position: "relative",
        }}
      >
        {hasError && (
          <Box
            sx={{
              position: "absolute",
              top: 1,
              right: 1,
              p: 1,
              color: "error.main",
              zIndex: 1,
            }}
          >
            <Tooltip title="Invalid JSON">
              <ErrorOutlineIcon fontSize="small" />
            </Tooltip>
          </Box>
        )}
        <Editor
          height="calc(100vh - 250px)"
          defaultLanguage="json"
          value={editorValue}
          onChange={handleEditorChange}
          theme={monacoTheme}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "off",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
          }}
        />
      </Paper>

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={hasError || !pendingState}
        color={hasError ? "error" : pendingState ? "warning" : "primary"}
        endIcon={<SaveIcon />}
        sx={{
          mt: 2,
          transition: "all 0.2s",
          "&:not(:disabled):hover": {
            transform: "translateY(-2px)",
          },
        }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default StateSection;
