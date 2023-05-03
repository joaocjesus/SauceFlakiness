export const log = (...content: any) => {
    if(process.env.REACT_APP_DEBUG?.toLowerCase() === 'true') {
        console.log(...content);
    }
}