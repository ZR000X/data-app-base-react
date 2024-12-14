/**
 * Error action for testing error handling.
 * Can be used directly or is called by the framework when other actions fail.
 */
export const error = (payload, state) => {
  return {
    response: payload.message || "An error occurred",
    newState: state,
    error: true,
  };
};
