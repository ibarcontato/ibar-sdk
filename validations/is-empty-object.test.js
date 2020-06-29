const  isEmptyObject  = require('./is-empty-object');

describe('isEmptyObject = (object)', () => {
  test('should return true when object is an empty object', async () => {
    const expected = true;
    const object = {};

    const received = isEmptyObject(object);
    expect(received).toEqual(expected);
  });

  test('should return false when object is not empty', async () => {
    const expected = false;
    const notEmptyObject = [1, 's', true, null, [], () => { }, { key: 'value' }, undefined];

    for (let object of notEmptyObject) {
      const received = isEmptyObject(object);
      expect(received).toEqual(expected);
    }
  });
})