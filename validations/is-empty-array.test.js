const  isEmptyArray  = require('./is-empty-array');

describe('isEmptyArray = (array)', () => {
  test('should return true when array is an empty list', async () => {
    const expected = true;
    const array = [];

    const received = isEmptyArray(array);
    expect(received).toEqual(expected);
  });

  test('should return false when array is not an empty list', async () => {
    const expected = false;
    const notEmptyArray = [1, 's', true, null, {}, [1, 2], () => { }, undefined];

    for (let array of notEmptyArray) {
      const received = isEmptyArray(array);
      expect(received).toEqual(expected);
    }
  });
})