import './CustomGlobal';

const log = (...args: any) => {
    if (process.env.REACT_APP_DEBUG?.toLowerCase() === 'true') {
        console.log(`(${getCallerFunctionName()})`, ...args);
    }
}

const error = (...args: any) => {
    if (process.env.REACT_APP_DEBUG?.toLowerCase() === 'true') {
        console.log(`(${getCallerFunctionName()}) %cError:`, 'color: red; font-weight: bold;', ...args);

    }
}

const getCallerFunctionName = () => {
    const error = new Error();
    const stackLines = error.stack?.split('\n');
    const callerInfo = stackLines ? stackLines[3] : '';

    const functionNameRegex = /at (\S+)/;
    const functionNameMatch = functionNameRegex.exec(callerInfo);
    const functionName = functionNameMatch ? functionNameMatch[1] : 'unknown';

    return functionName;
}

const logger = {
    log,
    error,
};

if (typeof window !== 'undefined') {
    (window as any).Logger = logger;
} else if (typeof global !== 'undefined') {
    (global as any).Logger = logger;
}






