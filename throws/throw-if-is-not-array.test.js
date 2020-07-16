
const throwIfIsNotArray = require('./throw-if-is-not-array');

describe('\n function throwIfIsNotArray(array, errorMessage, statusCode) ', () => {
  test('should return undefined when array is array type', async () => {
    const array = [];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    const expected = undefined;
    
    try {
      const received = throwIfIsNotArray(array, errorMessage, statusCode);
      expect(received).toEqual(expected)
    } 
    catch (received) { 
      fail();
    }
  })

  test('should return error object when array is not array type', async () => {
    const arrays = ['1', 11, null, undefined, {}, true, () => { }];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';
    
    for (let array in arrays) {
      const expected = JSON.stringify({
        statusCode: 'statusCode',
        inputData: array,
        errorMessage: 'errorMessage' 
      });

      try {
        throwIfIsNotArray(array, errorMessage, statusCode);
        fail();
      } 
      catch (received) { 
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    }
  })
})