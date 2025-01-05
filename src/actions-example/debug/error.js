import { createAction } from "../base/Action";

const handler = (input) => {
  return {
    state: input.state,
    response: input.payload.message || "An error occurred",
  };
};

export const errorAction = createAction(handler, {
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
});
