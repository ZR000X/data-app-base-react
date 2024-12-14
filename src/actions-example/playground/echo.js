/**
 * Simple echo action that returns the current state unchanged.
 * Useful for testing and debugging.
 */
export const echo = (payload, state) => {
  return {
    response: "Echo response sent",
    newState: state,
  };
};
