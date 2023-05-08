import './CustomGlobal';

const getCaller = () => {
  const error = new Error();
  const stackLines = error.stack?.split('\n');
  const parentFunctionInfo = stackLines ? stackLines[4] : '';

  const functionNameRegex = /at (\S+)/;

  const parentFunctionNameMatch = functionNameRegex.exec(parentFunctionInfo);
  const parent = parentFunctionNameMatch ? parentFunctionNameMatch[1] : 'unknown';

  return [parent, stackLines];
}

type MessageType = 'log' | 'warn' | 'error';

function logMsg(type: MessageType = 'log', ...args: any[]): void {
  if (process.env.REACT_APP_DEBUG?.toLowerCase() !== 'true') return;
  const prefix = getCaller()[0];

  switch (type) {
    case 'warn':
      console.warn(prefix, ...args);
      break;
    case 'error':
      console.error(prefix, ...args);
      break;
    case 'log':
    default:
      console.log(prefix, ...args);
      break;
  }
}

const log = (args: any) => {
  logMsg(args);
}

const error = (...args: any) => {
  logMsg('error', args);
}

const warn = (...args: any) => {
  logMsg('warn', args);
}

const logger = {
  log,
  error,
  warn,
};

if (typeof window !== 'undefined') {
  (window as any).Logger = logger;
} else if (typeof global !== 'undefined') {
  (global as any).Logger = logger;
}
