import './setup-browser-env';
import {
  createSuppressedConsoleError,
  restoreConsoleError,
} from './console-utilities';

restoreConsoleError(); // in case previous is kept on --watch
createSuppressedConsoleError([
  'Warning: Failed child context type',
  'Warning: Failed context type',
  'Warning: Failed prop type',
]);
