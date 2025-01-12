import React from "react";
import { NodeUI } from "../../../../../core/NodeUI";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export class CounterUI extends NodeUI {
  constructor(node) {
    super(node);
    this.state = {
      amount: "1",
    };
  }

  handleAmountChange = (event) => {
    const value = event.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      this.setState({ amount: value });
    }
  };

  getAmount = () => {
    return parseInt(this.state.amount) || 1;
  };

  render() {
    const { count } = this.getState();
    const { amount } = this.state;

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <TextField
            label="Amount"
            type="text"
            size="small"
            value={amount}
            onChange={this.handleAmountChange}
            sx={{ width: 100 }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <IconButton
            color="primary"
            size="large"
            onClick={() =>
              this.executeAction("increment", { amount: -this.getAmount() })
            }
          >
            <RemoveIcon fontSize="large" />
          </IconButton>
          <IconButton
            color="primary"
            size="large"
            onClick={() =>
              this.executeAction("increment", { amount: this.getAmount() })
            }
          >
            <AddIcon fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    );
  }
}
