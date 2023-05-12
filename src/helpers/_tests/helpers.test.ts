import { sortArray, getEmptyValues, throwErrorIfAnyEmpty } from 'helpers/helpers';

describe('helpers', () => {
  describe('sortArray', () => {
    const sampleArray = [
      { id: 1, name: 'c' },
      { id: 2, name: 'a' },
      { id: 3, name: 'b' },
    ];

    it('should sort the array in ascending order by the specified column', () => {
      const sorted = sortArray({ array: sampleArray, column: 'name', order: 'asc' });
      expect(sorted).toEqual([
        { id: 2, name: 'a' },
        { id: 3, name: 'b' },
        { id: 1, name: 'c' },
      ]);
    });

    it('should sort the array in descending order by the specified column', () => {
      const sorted = sortArray({ array: sampleArray, column: 'name', order: 'desc' });
      expect(sorted).toEqual([
        { id: 1, name: 'c' },
        { id: 3, name: 'b' },
        { id: 2, name: 'a' },
      ]);
    });

    it('should throw an error if the data type is not supported', () => {
      expect(() =>
        sortArray({
          array: [
            { id: 1, value: true },
            { id: 2, value: false },
          ],
          column: 'value',
          order: 'asc',
        })
      ).toThrowError('Unsupported data type for column "value": boolean');
    });
  });

  describe('getEmptyValues', () => {
    it('should return an array of keys with empty values', () => {
      const params = { name: '', age: 25, city: null };
      const emptyKeys = getEmptyValues(params);
      expect(emptyKeys).toEqual(['name', 'city']);
    });

    it('should return an empty array if no keys have empty values', () => {
      const params = { name: 'John', age: 25, city: 'New York' };
      const emptyKeys = getEmptyValues(params);
      expect(emptyKeys).toEqual([]);
    });
  });

  describe('throwErrorIfAnyEmpty', () => {
    it('should throw an error if any keys have empty values', () => {
      const params = { name: '', age: 25, city: null };
      expect(() => throwErrorIfAnyEmpty(params)).toThrowError('Missing required values(s): name,city');
    });

    it('should not throw an error if no keys have empty values', () => {
      const params = { name: 'John', age: 25, city: 'New York' };
      expect(() => throwErrorIfAnyEmpty(params)).not.toThrow();
    });
  });
});
