type Obj = { [key: string]: any };

interface SortProps {
    array: Obj[];
    column: string;
    order?: 'asc' | 'desc';
}

export const sortArray = ({ array, column, order = 'asc' }: SortProps): Obj[] => {
    // Determine the data type of the specified column
    const dataType = typeof array[0][column];

    // Set the comparison factor based on the order
    const comparisonFactor = order === 'asc' ? 1 : -1;

    const sorted = [...array].sort((a, b) => {
        if (dataType === 'number') {
            return comparisonFactor * (a[column] - b[column]);
        } else if (dataType === 'string') {
            if (a[column] < b[column]) {
                return -1 * comparisonFactor;
            }
            if (a[column] > b[column]) {
                return 1 * comparisonFactor;
            }
            return 0;
        } else {
            throw new Error(`Unsupported data type for column "${column}": ${dataType}`);
        }
    });
    return sorted;
};


export const getEmptyValues = (params: object) => {
    const empty: string[] = [];
    Object.entries(params).forEach((param) => {
        const [key, value] = param;
        if (value === null || value === '') {
            empty.push(key);
        }
    });

    return empty;
}

export const throwErrorIfAnyEmpty = (params: object) => {
    const empty: string[] = [];
    Object.entries(params).forEach((param) => {
        const [key, value] = param;
        if (value === null || value === '') {
            empty.push(key);
        }
    });

    if (empty.length > 0) throw Error(`Missing required values(s): ${empty.toString()}`);
}
