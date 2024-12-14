import { validateCounter } from "./validation";

/**
 * Example action showing how to modify existing state with validation.
 */
export const incrementCounter = (payload, state) => {
  // Validate the payload
  validateCounter(payload);

  // Extract values with defaults
  const { name, amount = 1 } = payload;

  // Check if counter exists
  if (!state.counters?.[name]) {
    throw new Error(`Counter ${name} does not exist`);
  }

  // Create new state with incremented counter
  const newState = {
    ...state,
    counters: {
      ...state.counters,
      [name]: state.counters[name] + amount,
    },
  };

  return {
    response: `Counter ${name} incremented by ${amount}`,
    newState,
  };
};
