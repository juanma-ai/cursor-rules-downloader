/**
 * Utility to mock console methods for testing
 */

// Store for original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
};

// Store captured logs for assertions
export interface CapturedLog {
  method: "log" | "error" | "warn" | "info" | "debug";
  args: any[];
}

let capturedLogs: CapturedLog[] = [];

/**
 * Mock all console methods
 * @param silent If true, no output will be produced. If false, logs will be captured and also passed to original methods.
 */
export function mockConsole(silent = true) {
  // Clear any previously captured logs
  capturedLogs = [];

  // Mock each method
  console.log = function (...args: any[]) {
    capturedLogs.push({ method: "log", args });
    if (!silent) {
      originalConsole.log(...args);
    }
  };

  console.error = function (...args: any[]) {
    capturedLogs.push({ method: "error", args });
    if (!silent) {
      originalConsole.error(...args);
    }
  };

  console.warn = function (...args: any[]) {
    capturedLogs.push({ method: "warn", args });
    if (!silent) {
      originalConsole.warn(...args);
    }
  };

  console.info = function (...args: any[]) {
    capturedLogs.push({ method: "info", args });
    if (!silent) {
      originalConsole.info(...args);
    }
  };

  console.debug = function (...args: any[]) {
    capturedLogs.push({ method: "debug", args });
    if (!silent) {
      originalConsole.debug(...args);
    }
  };
}

/**
 * Restore original console methods
 */
export function restoreConsole() {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
}

/**
 * Get all captured logs
 */
export function getCapturedLogs(): CapturedLog[] {
  return capturedLogs;
}

/**
 * Check if logs contain a specific string
 */
export function logsContain(
  method: CapturedLog["method"],
  substring: string
): boolean {
  return capturedLogs.some(
    (log) =>
      log.method === method &&
      log.args.some((arg) => String(arg).includes(substring))
  );
}

/**
 * Reset captured logs without affecting mocking
 */
export function resetCapturedLogs() {
  capturedLogs = [];
}
