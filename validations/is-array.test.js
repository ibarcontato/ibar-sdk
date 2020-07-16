const  isArray  = require('./is-array');

describe('isArray = (array)', () => {
  test('should return true when array is array', async () => {
    const expected = true;
    const array = [];

    const received = isArray(array);
    expect(received).toEqual(expected);
  });

  test('should return false when array is not array', async () => {
    const expected = false;
    const notArray = [1, 's', true, null, {}, () => { }];

    for (let array of notArray) {
      const received = isArray(array);
      expect(received).toEqual(expected);
    }
  });
})