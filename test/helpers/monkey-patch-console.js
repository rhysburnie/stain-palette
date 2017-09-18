/* eslint-disable no-console */
const originalConsoleError = console.error;

export function restoreConsole() {
  console.error = originalConsoleError;
}

export function createSuppressedConsole(ignoreThese = []) {
  if (console.error === originalConsoleError) {
    console.error = (...args) => {
      let supress = false;
      ignoreThese.forEach(ignore => {
        if (args[0].indexOf(ignore) === 0) {
          supress = true;
        }
      });
      if (supress) return;
      originalConsoleError.call(console, ...args);
    };
  }
}
