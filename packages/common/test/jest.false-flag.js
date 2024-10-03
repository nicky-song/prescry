import { format } from 'util';

const error = console.error;
const warn = console.warn;

// ensure tests fail if they call console.error or console.warn.... except for a few allowed exceptions
const touchable = new RegExp(
  /Warning\: componentWillReceiveProps\.*?Please update the following components\: TouchableOpacity/
);

console.warn = function(...args) {
  const ignore = [...args].findIndex((a) => touchable.test(a) < 0);

  if (!ignore) {
    warn(...args);
    throw new Error(format(...args));
  }
};

console.error = function(...args) {
  error(...args);
  throw new Error(format(...args));
};
