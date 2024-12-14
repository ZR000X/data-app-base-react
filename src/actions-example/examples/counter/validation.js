/**
 * Example validation function showing how to validate action payloads.
 */
export const validateCounter = (payload) => {
  // Validate name
  if (!payload.name) {
    throw new Error("Counter name is required");
  }
  if (typeof payload.name !== "string") {
    throw new Error("Counter name must be a string");
  }

  // Validate amount/initialValue if provided
  const numericValue = payload.amount ?? payload.initialValue;
  if (numericValue !== undefined) {
    if (typeof numericValue !== "number") {
      throw new Error("Numeric values must be numbers");
    }
    if (!Number.isFinite(numericValue)) {
      throw new Error("Numeric values must be finite numbers");
    }
  }
};
