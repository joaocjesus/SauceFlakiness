export const getEmptyValues = (params: object) => {
    const empty: string[] = [];
    Object.entries(params).forEach((param) => {
        const [key, value] = param;
        if(value === null || value == '') {
            empty.push(key);
        }
    });
    
    return empty;
}

export const throwErrorIfAnyEmpty = (params: object) => {
    const empty: string[] = [];
    Object.entries(params).forEach((param) => {
        const [key, value] = param;
        if(value === null || value == '') {
            empty.push(key);
        }
    });

    if (empty.length > 0) throw Error(`Missing required values(s): ${empty.toString()}`);
}
