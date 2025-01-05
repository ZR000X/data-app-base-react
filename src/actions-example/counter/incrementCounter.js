import { createAction } from "../base/Action";
import { validateCounter } from "./validation";

const handler = (input) => {
  validateCounter(input.payload);
  const { name, amount = 1 } = input.payload;

  if (!input.state.counters?.[name]) {
    throw new Error(`Counter ${name} does not exist`);
  }

  const newState = {
    ...input.state,
    counters: {
      ...input.state.counters,
      [name]: input.state.counters[name] + amount,
    },
  };

  return {
    state: newState,
    response: `Counter ${name} incremented by ${amount}`,
  };
};

export const incrementCounterAction = createAction(handler, {
  label: "Increment Counter",
  category: "Examples/Counter",
  description: "Increments a counter by specified amount",
  params: {
    name: {
      type: "string",
      description: "Name of the counter to increment",
      required: true,
    },
    amount: {
      type: "number",
      description: "Amount to increment by",
      required: false,
      default: 1,
    },
  },
});
