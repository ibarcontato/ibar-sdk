
const throwIfIsNotUndefinedNeitherString = require('./throw-if-is-not-undefined-neither-string');

describe('\n function throwIfIsNotUndefinedNeitherString(data, errorMessage, statusCode)', () => {
  test('should return undefined when data is string or undefined', async () => {
    const datas = ['', undefined];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    for (let data of datas) {
      const expected = undefined;

      try {
        const received = throwIfIsNotUndefinedNeitherString(data, errorMessage, statusCode);
        expect(received).toEqual(expected)
      }
      catch (received) {
        fail();
      }
    }
  })

  test('should return error object when data is not string neither undefined', async () => {
    const datas = [{}, 11, null, [], true, () => { }];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    for (let data of datas) {
      const expected = JSON.stringify({
        statusCode: 'statusCode',
        inputData: data,
        errorMessage: 'errorMessage'
      });

      try {
        throwIfIsNotUndefinedNeitherString(data, errorMessage, statusCode);
        fail();
      }
      catch (received) {
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    }
  })
})