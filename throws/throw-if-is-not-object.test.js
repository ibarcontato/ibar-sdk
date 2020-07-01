
const throwIfIsNotObject = require('./throw-if-is-not-object');

describe('function throwIfIsNotObject(obj, errorMessage, statusCode) ', () => {
  test('should return undefined when obj is object', async () => {
    const obj = {};
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    const expected = undefined;
    
    try {
      const received = throwIfIsNotObject(obj, errorMessage, statusCode);
      expect(received).toEqual(expected)
    } 
    catch (received) { 
      fail();
    }
  })

  test('should return error object when obj is not object', async () => {
    const objs = ['1', 11, null, undefined, [], true, () => { }];
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';
    
    for (let obj in objs) {
      const expected = JSON.stringify({
        statusCode: 'statusCode',
        inputData: obj,
        errorMessage: 'errorMessage'
      });

      try {
        throwIfIsNotObject(obj, errorMessage, statusCode);
        fail();
      } 
      catch (received) { 
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
    }
  })
})