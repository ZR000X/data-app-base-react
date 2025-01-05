import { createAction } from "../base/Action";
import { validateCounter } from "./validation";

const handler = (input) => {
  validateCounter(input.payload);
  const { name, initialValue = 0 } = input.payload;

  if (input.state.counters?.[name]) {
    throw new Error(`Counter ${name} already exists`);
  }

  const newState = {
    ...input.state,
    counters: {
      ...input.state.counters,
      [name]: initialValue,
    },
  };

  return {
    state: newState,
    response: `Counter ${name} created with initial value ${initialValue}`,
  };
};

export const createCounterAction = createAction(handler, {
  label: "Create Counter",
  category: "Examples/Counter",
  description: "Creates a new counter with initial value",
  params: {
    name: {
      type: "string",
      description: "Name of the counter",
      required: true,
    },
    initialValue: {
      type: "number",
      description: "Starting value for the counter",
      required: false,
      default: 0,
    },
  },
});
