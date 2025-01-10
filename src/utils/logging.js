// Initialize an array to store logs
let logs = [];
let logCallback = null;
let logCounter = 0;

// Function to set the callback that will be called when new logs are added
export const setLogCallback = (callback) => {
  logCallback = callback;
};

// Function to add a log entry
export const log = (message, level = "info") => {
  const logEntry = {
    id: String(++logCounter).padStart(8, "0"),
    timestamp: new Date().toISOString(),
    message,
    level,
  };

  // Add to start for reverse chronological order
  logs.unshift(logEntry);

  if (logCallback) {
    logCallback(logEntry);
  }
};

// Function to clear logs
export const clearLogs = () => {
  logs = [];
  logCounter = 0;
  if (logCallback) {
    logCallback(null, true);
  }
};

// Function to get all logs
export const getLogs = () => {
  return [...logs];
};
