
const throwIfIsNotString = require('./throw-if-is-not-string');

describe.only('\n function throwIfIsNotString(data, errorMessage, statusCode)', () => {
  test('should return undefined when data is string', async () => {
    const data = '';
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    const expected = undefined;
    
    try {
      const received = throwIfIsNotString(data, errorMessage, statusCode);
      expect(received).toEqual(expected)
    } 
    catch (received) { 
      fail();
    }
  })

  test('should return error object when data is not string', async () => {
    const datas = [{}, 11, null, undefined, [], true, () => { }];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';
    
    for (let data of datas) {
      const expected = JSON.stringify({
        statusCode: 'statusCode',
        inputData: data,
        errorMessage: 'errorMessage'
      });

      try {
        throwIfIsNotString(data, errorMessage, statusCode);
        fail();
      } 
      catch (received) { 
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    }
  })
})