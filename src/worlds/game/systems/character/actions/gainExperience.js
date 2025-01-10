import { Action } from "../../../../../core/Action";
import { log } from "../../../../../utils/logging";

class GainExperienceAction extends Action {
  constructor() {
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
    super("gainExperience", params);
  }

  execute({ state, payload }) {
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
  }
}

export const gainExperienceAction = new GainExperienceAction();
