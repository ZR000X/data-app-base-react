import { Action } from "../../../../../core/Action";
import { log } from "../../../../../utils/logging";

class IncrementAction extends Action {
  constructor() {
    const params = {
      amount: {
        type: "number",
        description: "Amount to increment by",
        default: 1,
        required: false,
      },
      maxValue: {
        type: "number",
        description: "Maximum value allowed",
        default: 100,
        required: false,
      },
    };
    super("increment", params);
    console.log("IncrementAction created with params:", params);
  }

  execute({ state, payload }) {
    const { amount = 1, maxValue = 100 } = payload;
    const currentCount = state.count || 0;
    const newCount = Math.min(currentCount + amount, maxValue);

    log(
      `Counter incremented from ${currentCount} to ${newCount} (amount: ${amount}, max: ${maxValue})`
    );

    if (newCount >= 10) {
      log("Counter reached double digits!", "warning");
    }

    if (newCount === maxValue) {
      log(`Counter reached maximum value of ${maxValue}!`, "warning");
    }

    return {
      state: { ...state, count: newCount },
      response: `Counter incremented to ${newCount}`,
    };
  }
}

// Create and verify the instance
const incrementAction = new IncrementAction();
console.log("Increment action created:", incrementAction);
console.log(
  "Has getDefaultPayload:",
  typeof incrementAction.getDefaultPayload === "function"
);

export { incrementAction };
