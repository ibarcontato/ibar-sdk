const  isObject  = require('./is-object');

describe('isObject = (object)', () => {
  test('should return true when object is object', async () => {
    const expected = true;
    const object = {};

    const received = isObject(object);
    expect(received).toEqual(expected);
  });

  test('should return false when object is not object', async () => {
    const expected = false;
    const notObjects = [1, 's', true, null, [], () => { }];

    for (let object of notObjects) {
      const received = isObject(object);
      expect(received).toEqual(expected);
    }
  });
})