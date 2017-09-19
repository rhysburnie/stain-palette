/* eslint-disable no-console */
const originalConsoleError = console.error;

export function restoreConsoleError() {
  console.error = originalConsoleError;
}

export function createSuppressedConsoleError(ignoreThese = []) {
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

// creates a sinon.spy instance
// wrapping console.error and
// adds additional method to it
// (spy.errorCallContainsOneOf)
// NOTE: requires you pass it sinon
export function createConsoleErrorSpy(sinon) {
  if (!sinon) {
    throw new Error('createConsoleErrorSpy requires you pass sinon to it');
  }
  const spy = sinon.spy(console, 'error');
  spy.errorCallContainsOneOf = (messages = [], callIndex) => {
    if (messages.length === 0 || typeof callIndex !== 'number') {
      return 'errorsContainsOneOf requires an array of messages and an callIndex number';
    }
    if (!console.error.getCall) {
      // the spy must have been `.restore()`d.
      return 'the spy has either had no calls or has been restored';
    }
    const log = console.error.getCall(callIndex).args[0];
    let bool = false;
    messages.forEach(msg => {
      if (log.indexOf(msg) === 0) {
        bool = true;
      }
    });
    return bool;
  };
  return spy;
}
