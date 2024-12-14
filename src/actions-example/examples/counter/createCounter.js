import { validateCounter } from "./validation";

/**
 * Example action showing how to create new state entries with validation.
 */
export const createCounter = (payload, state) => {
  // Validate the payload
  validateCounter(payload);

  // Extract values with defaults
  const { name, initialValue = 0 } = payload;

  // Check if counter already exists
  if (state.counters?.[name]) {
    throw new Error(`Counter ${name} already exists`);
  }

  // Create new state with the counter
  const newState = {
    ...state,
    counters: {
      ...state.counters,
      [name]: initialValue,
    },
  };

  return {
    response: `Counter ${name} created with initial value ${initialValue}`,
    newState,
  };
};
