/**
 * This file is used to set up the test environment before running tests.
 * It's imported by the Mocha runner.
 */

// Set up module aliases for mocks
import Module = require("module");

// Store the original require
const originalRequire = Module.prototype.require;

// Define a type for the global mocks object
interface GlobalWithMocks extends NodeJS.Global {
  __mocks__?: Record<string, unknown>;
}

// Override the require function to return mocks for certain modules
Module.prototype.require = function (request: string) {
  if (request === "vscode") {
    return require("./mocks/vscode");
  }

  // Check if we have a mock for this module in the global __mocks__ object
  const globalWithMocks = global as GlobalWithMocks;
  if (globalWithMocks.__mocks__ && globalWithMocks.__mocks__[request]) {
    return globalWithMocks.__mocks__[request];
  }

  return originalRequire.call(this, request);
};

// Set NODE_ENV to test
process.env.NODE_ENV = "test";

// ---- Console Mocking ----

const capturedLogs: Record<string, any[]> = {
  log: [],
  error: [],
  warn: [],
  info: [],
};

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
};

// Show logs when SHOW_LOGS is set to true
const shouldShowLogs = process.env.SHOW_LOGS === "true";

// Override console methods to capture logs
console.log = function (...args) {
  capturedLogs.log.push(args);
  if (shouldShowLogs) {
    originalConsole.log(...args);
  }
};

console.error = function (...args) {
  capturedLogs.error.push(args);
  if (shouldShowLogs) {
    originalConsole.error(...args);
  }
};

console.warn = function (...args) {
  capturedLogs.warn.push(args);
  if (shouldShowLogs) {
    originalConsole.warn(...args);
  }
};

console.info = function (...args) {
  capturedLogs.info.push(args);
  if (shouldShowLogs) {
    originalConsole.info(...args);
  }
};

// Export functions for use in tests
export function resetCapturedLogs() {
  Object.keys(capturedLogs).forEach((key) => {
    capturedLogs[key] = [];
  });
}

export function getCapturedLogs() {
  return capturedLogs;
}

export function logsContain(
  type: "log" | "error" | "warn" | "info",
  substring: string
) {
  return capturedLogs[type].some((args) =>
    args.some((arg: string) => String(arg).includes(substring))
  );
}

// Set up automatic cleanup when node process exits
process.on("exit", () => {
  // Restore original console methods
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
});
