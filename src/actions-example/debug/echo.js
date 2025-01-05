import { createAction } from "../base/Action";

const handler = (input) => {
  return {
    state: input.state,
    response: "Echo response sent",
  };
};

export const echoAction = createAction(handler, {
  label: "Echo State",
  category: "Debug",
  description: "Returns the current state without modifications",
  params: {},
});
