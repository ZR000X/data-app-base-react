import { Action } from "../../../../../core/Action";
import { log } from "../../../../../utils/logging";

class LevelUpAction extends Action {
  constructor() {
    const params = {
      statPoints: {
        type: "number",
        description: "Number of stat points to allocate",
        default: 1,
        required: true,
      },
      attribute: {
        type: "string",
        description:
          "Attribute to increase (strength, dexterity, intelligence)",
        default: "strength",
        required: true,
      },
    };
    super("levelUp", params);
  }

  execute({ state, payload }) {
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
  }
}

export const levelUpAction = new LevelUpAction();
