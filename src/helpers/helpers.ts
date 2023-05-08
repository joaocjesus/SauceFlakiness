type Obj = { [key: string]: any };

interface SortProps {
    array: Obj[];
    columnName: string;
    sortOrder?: 'asc' | 'desc';
}

export const sortArray = ({ array, columnName, sortOrder = 'asc' }: SortProps): Obj[] => {
    // Determine the data type of the specified column
    const dataType = typeof array[0][columnName];

    return array.sort((a, b) => {
        if (dataType === 'number') {
            return sortOrder === 'asc'
                ? a[columnName] - b[columnName]
                : b[columnName] - a[columnName];
        } else if (dataType === 'string') {
            const comparison = sortOrder === 'asc' ? 1 : -1;
            if (a[columnName] < b[columnName]) {
                return -1 * comparison;
            }
            if (a[columnName] > b[columnName]) {
                return 1 * comparison;
            }
            return 0;
        } else {
            throw new Error(`Unsupported data type for column "${columnName}": ${dataType}`);
        }
    });
}

export const getEmptyValues = (params: object) => {
    const empty: string[] = [];
    Object.entries(params).forEach((param) => {
        const [key, value] = param;
        if (value === null || value == '') {
            empty.push(key);
        }
    });

    return empty;
}

export const throwErrorIfAnyEmpty = (params: object) => {
    const empty: string[] = [];
    Object.entries(params).forEach((param) => {
        const [key, value] = param;
        if (value === null || value == '') {
            empty.push(key);
        }
    });

    if (empty.length > 0) throw Error(`Missing required values(s): ${empty.toString()}`);
}
