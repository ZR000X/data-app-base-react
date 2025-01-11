import React from "react";
import { NodeUI } from "../../../../../core/NodeUI";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Grid,
  Paper,
} from "@mui/material";

export class CharacterUI extends NodeUI {
  render() {
    const { level, experience, strength, dexterity, intelligence } =
      this.getState();

    // Calculate XP progress (assuming 100 XP per level)
    const xpProgress = experience % 100;

    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Level {level} Character
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Experience: {experience}/100
            </Typography>
            <LinearProgress
              variant="determinate"
              value={xpProgress}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Grid container spacing={3}>
            <StatDisplay label="Strength" value={strength} />
            <StatDisplay label="Dexterity" value={dexterity} />
            <StatDisplay label="Intelligence" value={intelligence} />
          </Grid>
        </Paper>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={() => this.executeAction("gainExperience", { amount: 10 })}
          >
            Train (+10 XP)
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.executeAction("levelUp", {})}
            disabled={experience < 100}
          >
            Level Up
          </Button>
        </Box>
      </Box>
    );
  }
}

function StatDisplay({ label, value }) {
  return (
    <Grid item xs={4}>
      <Paper sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </Paper>
    </Grid>
  );
}
