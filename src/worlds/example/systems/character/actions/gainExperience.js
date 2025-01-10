import { Action } from "../../../../../core/Action";
import { log } from "../../../../../utils/logging";

const params = {
  amount: {
    type: "number",
    description: "Amount of experience to gain",
    default: 50,
    required: true,
  },
  source: {
    type: "string",
    description: "Source of the experience (quest, combat, training)",
    default: "combat",
    required: false,
  },
  multiplier: {
    type: "number",
    description: "Experience multiplier (events, bonuses)",
    default: 1,
    required: false,
  },
};

const handler = ({ state, payload }) => {
  const { amount, source = "combat", multiplier = 1 } = payload;

  if (amount <= 0) {
    throw new Error("Experience amount must be positive");
  }

  const finalAmount = Math.round(amount * multiplier);
  const currentExp = state.experience || 0;
  const newExp = currentExp + finalAmount;
  const currentLevel = state.level || 1;
  const expNeeded = currentLevel * 100;

  const newState = {
    ...state,
    experience: newExp,
  };

  log(`Gained ${finalAmount} experience from ${source}`);

  if (multiplier > 1) {
    log(`Experience multiplier active: ${multiplier}x`, "info");
  }

  if (newExp >= expNeeded) {
    log(`Level up available! (${newExp}/${expNeeded})`, "warning");
  }

  return {
    state: newState,
    response: `Gained ${finalAmount} experience (${source}). Total: ${newExp}/${expNeeded}`,
  };
};

const tests = [
  {
    input: {
      state: { level: 1, experience: 0 },
      payload: { amount: 50, source: "quest", multiplier: 2 },
    },
    output: {
      state: { level: 1, experience: 100 },
      response: "Gained 100 experience (quest). Total: 100/100",
    },
  },
  {
    input: {
      state: { level: 1, experience: 50 },
      payload: { amount: 25 },
    },
    output: {
      state: { level: 1, experience: 75 },
      response: "Gained 25 experience (combat). Total: 75/100",
    },
  },
];

export const gainExperienceAction = new Action(
  "gainExperience",
  params,
  handler,
  tests
);
