import React from "react";
import { NodeUI } from "../../../../../core/NodeUI";
import { Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export class CounterUI extends NodeUI {
  render() {
    const { count } = this.getState();

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h1" sx={{ mb: 4, fontWeight: "bold" }}>
          {count}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton
            color="primary"
            size="large"
            onClick={() => this.executeAction("increment", { amount: -1 })}
          >
            <RemoveIcon fontSize="large" />
          </IconButton>
          <IconButton
            color="primary"
            size="large"
            onClick={() => this.executeAction("increment", { amount: 1 })}
          >
            <AddIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    );
  }
}
