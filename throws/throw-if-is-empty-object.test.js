
const throwIfIsEmptyObject = require('./throw-if-is-empty-object');

describe('\n function throwIfIsEmptyObject(obj, errorMessage, statusCode)', () => {
  test('should return undefined when obj is not empty', async () => {
    const obj = { key: 'value' };
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    const expected = undefined;

    try {
      const received = throwIfIsEmptyObject(obj, errorMessage, statusCode);
      expect(received).toEqual(expected)
    }
    catch (received) {
      fail();
    }
  })

  test('should return error object when obj is empty', async () => {
    const obj = {};
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    const expected = JSON.stringify({
      statusCode: 'statusCode',
      inputData: obj,
      errorMessage: 'errorMessage'
    });

    try {
      throwIfIsEmptyObject(obj, errorMessage, statusCode);
      fail();
    }
    catch (received) {
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })
})