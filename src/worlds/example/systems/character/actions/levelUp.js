import { Action } from "../../../../../core/Action";
import { log } from "../../../../../utils/logging";

const params = {
  statPoints: {
    type: "number",
    description: "Number of stat points to allocate",
    default: 1,
    required: true,
  },
  attribute: {
    type: "string",
    description: "Attribute to increase (strength, dexterity, intelligence)",
    default: "strength",
    required: true,
  },
};

const handler = ({ state, payload }) => {
  const { statPoints, attribute } = payload;
  const validAttributes = ["strength", "dexterity", "intelligence"];

  if (!validAttributes.includes(attribute)) {
    throw new Error(`Invalid attribute: ${attribute}`);
  }

  const currentLevel = state.level || 1;
  const currentExp = state.experience || 0;
  const expNeeded = currentLevel * 100;

  if (currentExp < expNeeded) {
    log(
      `Not enough experience to level up! (${currentExp}/${expNeeded})`,
      "warning"
    );
    throw new Error(
      `Need ${expNeeded - currentExp} more experience to level up`
    );
  }

  const newState = {
    ...state,
    level: currentLevel + 1,
    experience: currentExp - expNeeded,
    [attribute]: (state[attribute] || 0) + statPoints,
  };

  log(`Character leveled up to ${newState.level}!`);
  log(`Increased ${attribute} by ${statPoints} points`, "info");

  return {
    state: newState,
    response: `Leveled up to ${newState.level} and increased ${attribute} to ${newState[attribute]}`,
  };
};

const tests = [
  {
    input: {
      state: { level: 1, experience: 100, strength: 10 },
      payload: { statPoints: 1, attribute: "strength" },
    },
    output: {
      state: { level: 2, experience: 0, strength: 11 },
      response: "Leveled up to 2 and increased strength to 11",
    },
  },
  {
    input: {
      state: { level: 1, experience: 50, strength: 10 },
      payload: { statPoints: 1, attribute: "strength" },
    },
    output: {
      error: "Need 50 more experience to level up",
    },
  },
];

export const levelUpAction = new Action("levelUp", params, handler, tests);
