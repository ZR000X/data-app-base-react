import { Action } from "../../../../../core/Action";
import { log } from "../../../../../utils/logging";

const params = {
  amount: {
    type: "number",
    description: "Amount to increment by",
    default: 1,
    required: false,
  },
};

const handler = ({ state, payload }) => {
  const { amount = 1 } = payload;
  const count = (state.count || 0) + amount;

  log(`Counter incremented from ${state.count} to ${count}`);

  if (count >= 10) {
    log("Counter reached double digits!", "warning");
  }

  return {
    state: { ...state, count },
    response: `Counter incremented to ${count}`,
  };
};

const tests = [
  {
    input: {
      state: { count: 0 },
      payload: { amount: 1 },
    },
    output: {
      state: { count: 1 },
      response: "Counter incremented to 1",
    },
  },
  {
    input: {
      state: { count: 5 },
      payload: { amount: 3 },
    },
    output: {
      state: { count: 8 },
      response: "Counter incremented to 8",
    },
  },
];

export const incrementAction = new Action("increment", params, handler, tests);
