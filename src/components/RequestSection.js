import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Collapse,
  IconButton,
  ListSubheader,
} from "@mui/material";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { actions } from "../actions";
import Editor from "@monaco-editor/react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SendIcon from "@mui/icons-material/Send";
import { useMonacoTheme } from "../hooks/useMonacoTheme";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { debounce } from "@mui/material/utils";

const RequestSection = ({ onRequest }) => {
  const monacoTheme = useMonacoTheme();
  const [action, setAction] = useState("");
  const [params, setParams] = useState("{}");
  const [hasError, setHasError] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const selectedAction = actions[action];
  const paramDefs = selectedAction?.params;

  // Debounce the search to prevent freezing
  const debouncedSetSearchQuery = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 150),
    []
  );

  // Enhanced sorting and filtering of actions
  const sortedActions = useMemo(() => {
    const actionEntries = Object.entries(actions);
    const categories = {};

    // Filter actions based on search query
    const filteredEntries = actionEntries.filter(([key, action]) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        action.label.toLowerCase().includes(searchLower) ||
        action.description?.toLowerCase().includes(searchLower) ||
        key.toLowerCase().includes(searchLower)
      );
    });

    // Group filtered actions by category
    filteredEntries.forEach(([key, action]) => {
      const category = action.category || "Other";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({ key, ...action });
    });

    // Sort categories and actions
    return Object.entries(categories)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, categoryActions]) => ({
        category,
        actions: categoryActions.sort((a, b) => a.label.localeCompare(b.label)),
      }))
      .filter((category) => category.actions.length > 0); // Remove empty categories
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const parsedParams = params ? JSON.parse(params) : {};
      setHasError(false);
      onRequest({
        action,
        params: parsedParams,
      });
    } catch (error) {
      setHasError(true);
      onRequest({
        action: "error",
        params: {
          message: `JSON Parse Error: ${error.message}`,
        },
      });
    }
  };

  const handleEditorChange = (value) => {
    try {
      JSON.parse(value);
      setParams(value);
      setHasError(false);
    } catch (e) {
      setParams(value);
      setHasError(true);
    }
  };

  const handleActionChange = (e) => {
    const newAction = e.target.value;
    setAction(newAction);

    if (newAction && actions[newAction].params) {
      const template = {};
      Object.entries(actions[newAction].params).forEach(([key, def]) => {
        template[key] = `/* ${def.type}${def.required ? " (required)" : ""} - ${
          def.description
        } */`;
      });
      setParams(JSON.stringify(template, null, 2));
    } else {
      setParams("{}");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    e.stopPropagation();
    debouncedSetSearchQuery(e.target.value);
  };

  // Focus the search input when dropdown opens
  const handleDropdownOpen = () => {
    // Use setTimeout to ensure the dropdown is rendered
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Request
        </Typography>
        <IconButton
          size="small"
          onClick={() => setShowHelp(!showHelp)}
          color={showHelp ? "primary" : "default"}
        >
          <HelpOutlineIcon />
        </IconButton>
      </Box>

      <TextField
        select
        fullWidth
        label="Select Action"
        value={action}
        onChange={handleActionChange}
        margin="normal"
        sx={{ mb: 2 }}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: { maxHeight: 450 },
            },
          },
          onOpen: handleDropdownOpen,
        }}
      >
        <ListSubheader
          sx={{
            bgcolor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 2,
            p: 1,
            m: 0,
          }}
        >
          <TextField
            inputRef={searchInputRef}
            size="small"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            placeholder="Search actions..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                bgcolor: "background.paper",
              },
            }}
          />
        </ListSubheader>

        {sortedActions.map(({ category, actions: categoryActions }) => [
          <ListSubheader
            key={category}
            sx={{
              bgcolor: "background.paper",
              lineHeight: "32px",
              color: "primary.main",
              position: "sticky",
              top: 56,
              zIndex: 1,
            }}
          >
            {category}
          </ListSubheader>,
          ...categoryActions.map((action) => (
            <MenuItem
              key={action.key}
              value={action.key}
              sx={{
                pl: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {action.label}
              </Typography>
              {action.beta && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: "warning.main",
                    color: "warning.contrastText",
                  }}
                >
                  BETA
                </Typography>
              )}
            </MenuItem>
          )),
        ])}
        {sortedActions.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No actions found
            </Typography>
          </MenuItem>
        )}
      </TextField>

      <Collapse in={showHelp && !!selectedAction}>
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 2, bgcolor: "background.default" }}
        >
          {selectedAction ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {selectedAction.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedAction.description}
                </Typography>
              </Box>

              {Object.keys(paramDefs || {}).length > 0 ? (
                <>
                  <Typography
                    variant="subtitle2"
                    color="primary"
                    gutterBottom
                    sx={{ mt: 2 }}
                  >
                    Parameters:
                  </Typography>
                  {Object.entries(paramDefs).map(([key, def]) => (
                    <Box
                      key={key}
                      sx={{
                        mb: 2,
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace" }}
                        >
                          <strong>{key}</strong>
                        </Typography>
                        {def.required && (
                          <Typography
                            component="span"
                            color="error"
                            sx={{ ml: 1, fontSize: "0.75rem" }}
                          >
                            required
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", color: "text.secondary" }}
                      >
                        Type: <code>{def.type}</code>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {def.description}
                      </Typography>
                    </Box>
                  ))}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  This action doesn't require any parameters.
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Select an action to see its documentation.
            </Typography>
          )}
        </Paper>
      </Collapse>

      <Box
        sx={{
          border: 1,
          borderColor: hasError ? "error.main" : "divider",
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Editor
          height="200px"
          defaultLanguage="json"
          value={params}
          onChange={handleEditorChange}
          theme={monacoTheme}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={!action || hasError}
        color={hasError ? "error" : "primary"}
        endIcon={<SendIcon />}
        sx={{
          mt: 2,
          transition: "all 0.2s",
          "&:not(:disabled):hover": {
            transform: "translateY(-2px)",
          },
        }}
      >
        Send Request
      </Button>
    </Box>
  );
};

export default RequestSection;
