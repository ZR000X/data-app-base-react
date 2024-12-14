import { echo } from "./playground/echo";
import { error } from "./playground/error";
import { createCounter } from "./examples/counter/createCounter";
import { incrementCounter } from "./examples/counter/incrementCounter";

/**
 * Action dictionary with parameter definitions.
 * Each action needs:
 * - handler: The function that executes the action
 * - label: User-friendly name shown in the UI
 * - category: For grouping related actions
 * - description: Explains what the action does
 * - params: Describes the expected payload structure
 */
export const actions = {
  // Debug actions
  echo: {
    handler: echo,
    label: "Echo State",
    category: "Debug",
    description: "Returns the current state without modifications",
    params: {},
  },
  error: {
    handler: error,
    label: "Trigger Error",
    category: "Debug",
    description: "Triggers an error response for testing error handling",
    params: {
      message: {
        type: "string",
        description: "Error message to display",
        required: true,
      },
    },
  },

  // Example Counter actions
  createCounter: {
    handler: createCounter,
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
  },
  incrementCounter: {
    handler: incrementCounter,
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
  },
};

/**
 * Central action handler that processes all actions.
 * Validates the action exists and handles errors uniformly.
 */
export const handleAction = (type, payload, state) => {
  const action = actions[type];
  if (!action) {
    return error({ message: `Unknown action type: ${type}` }, state);
  }

  try {
    const result = action.handler(payload, state);
    if (!result.newState) {
      return error({ message: `Action ${type} must return a newState` }, state);
    }
    return result;
  } catch (e) {
    return error({ message: `Action ${type} failed: ${e.message}` }, state);
  }
};
