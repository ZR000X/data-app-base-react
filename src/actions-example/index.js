import { DataSystem } from "../utils/DataSystem";
import { echoAction } from "./debug/echo";
import { errorAction } from "./debug/error";
import { createCounterAction } from "./counter/createCounter";
import { incrementCounterAction } from "./counter/incrementCounter";

// Export actions for use in components
export const actions = {
  echo: echoAction,
  error: errorAction,
  createCounter: createCounterAction,
  incrementCounter: incrementCounterAction,
};

// Define the initial state of the data system
const initialState = {};

// Create DataSystem instance
export const dataSystem = new DataSystem(actions, initialState);

// Central action handler that uses DataSystem
export const handleAction = (type, payload, state) => {
  try {
    return dataSystem.runAction(type, payload);
  } catch (e) {
    return {
      response: `Action ${type} failed: ${e.message}`,
      newState: state,
      error: true,
    };
  }
};
