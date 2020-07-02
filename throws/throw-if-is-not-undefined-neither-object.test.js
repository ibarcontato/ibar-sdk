
const throwIfIsNotUndefinedNeitherObject = require('./throw-if-is-not-undefined-neither-object');

describe('\n function throwIfIsNotUndefinedNeitherObject(data, errorMessage, statusCode)', () => {
  test('should return undefined when data is object or undefined', async () => {
    const datas = [{}, undefined];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';
    
    for (let data of datas) {
      const expected = undefined;

      try {
        const received = throwIfIsNotUndefinedNeitherObject(data, errorMessage, statusCode);
        expect(received).toEqual(expected)
      }
      catch (received) {
        fail();
      }
    }
  })

  test('should return error object when data is not object neither undefined', async () => {
    const datas = ['', 11, null, [], true, () => { }];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    for (let data of datas) {
      const expected = JSON.stringify({
        statusCode: 'statusCode',
        inputData: data,
        errorMessage: 'errorMessage'
      });

      try {
        throwIfIsNotUndefinedNeitherObject(data, errorMessage, statusCode);
        fail();
      }
      catch (received) {
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    }
  })
})