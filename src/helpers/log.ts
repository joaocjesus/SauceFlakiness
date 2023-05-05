function getTrace() {
    const error = new Error();
    const stackLines = error.stack?.split('\n');
    const callerInfo = stackLines ? stackLines[2] : ''; // The 3rd line in the stack trace contains the caller's info

    const fileInfoRegex = /\((.+)\)/; // Regex to extract the file path, line number, and column number
    const fileInfoMatch = fileInfoRegex.exec(callerInfo);
    const fileInfo = fileInfoMatch ? fileInfoMatch[1] : 'unknown';

    console.log('Called from:', fileInfo);
}

export const log = (...content: any) => {
    if (process.env.REACT_APP_DEBUG?.toLowerCase() === 'true') {
        console.log(getTrace(), ...content);
    }
}