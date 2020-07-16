
const throwIfIsEmptyArray = require('./throw-if-is-empty-array');

describe('\n function throwIfIsEmptyArray(array, errorMessage, statusCode)', () => {
  test('should return undefined when array is not empty', async () => {
    const array = [1];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    const expected = undefined;

    try {
      const received = throwIfIsEmptyArray(array, errorMessage, statusCode);
      expect(received).toEqual(expected)
    }
    catch (received) {
      fail();
    }
  })

  test('should return error object when array is empty', async () => {
    const array = [];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    const expected = JSON.stringify({
      statusCode: 'statusCode',
      inputData: array,
      errorMessage: 'errorMessage'
    });

    try {
      throwIfIsEmptyArray(array, errorMessage, statusCode);
      fail();
    }
    catch (received) {
      expect(JSON.parse(received)).toEqual(JSON.parse(expected))
    }
  })
})