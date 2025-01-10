import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

function TestCase({ test, result, index }) {
  return (
    <Accordion
      sx={{
        mb: 0.5,
        "&:before": { display: "none" },
        boxShadow: "none",
        bgcolor: "background.default",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          borderLeft: 4,
          borderColor: result.passed ? "success.main" : "error.main",
        }}
      >
        <Typography
          sx={{
            color: result.passed ? "success.main" : "error.main",
            fontWeight: "medium",
          }}
        >
          {result.message}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Input:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                fontSize: "0.75rem",
                overflow: "auto",
              }}
            >
              {JSON.stringify(test.input, null, 2)}
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Expected:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                fontSize: "0.75rem",
                overflow: "auto",
              }}
            >
              {JSON.stringify(test.output, null, 2)}
            </Box>
          </Box>

          {!result.passed && result.actual && (
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Actual:
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 1,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  fontSize: "0.75rem",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(result.actual, null, 2)}
              </Box>
            </Box>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

function TestResults({ system }) {
  const actions = Array.from(system.nodes.values()).flatMap((node) =>
    Array.from(node.actions.values())
  );

  const stats = actions.reduce(
    (acc, action) => {
      const results = action.getTestResults();
      const passed = results.filter((r) => r.passed).length;
      return {
        total: acc.total + results.length,
        passed: acc.passed + passed,
        failed: acc.failed + (results.length - passed),
      };
    },
    { total: 0, passed: 0, failed: 0 }
  );

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test Results: {system.name}
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Typography color="success.main">
          Passed: {stats.passed}/{stats.total}
        </Typography>
        {stats.failed > 0 && (
          <Typography color="error.main">Failed: {stats.failed}</Typography>
        )}
      </Box>

      {actions.map((action) => (
        <Accordion key={action.getName()} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {action.getTestResults().every((r) => r.passed) ? (
                <CheckCircleIcon color="success" />
              ) : (
                <ErrorIcon color="error" />
              )}
              <Typography>{action.getName()}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {action.getTestResults().map((result, index) => (
              <TestCase
                key={index}
                test={result.testCase}
                result={result}
                index={index}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
}

export default TestResults;
