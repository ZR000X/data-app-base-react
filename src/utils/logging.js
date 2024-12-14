// Initialize an array to store logs
let logs = [];
let logCallback = null;

// Function to set the callback that will be called when new logs are added
export const setLogCallback = (callback) => {
  logCallback = callback;
};

// Function to add a log entry
export const log = (message, level = "info") => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    level,
  };

  logs.push(logEntry);

  // If there's a callback registered, call it with the new log
  if (logCallback) {
    logCallback(logEntry);
  }
};

// Function to clear logs
export const clearLogs = () => {
  logs = [];
  if (logCallback) {
    logCallback(null, true);
  }
};

// Function to get all logs
export const getLogs = () => {
  return [...logs];
};
