
const throwIfIsNotClassOf = require('./throw-if-is-not-class-of');

describe('function throwIfIsNotClassOf(obj, objClass, errorMessage, statusCode)', () => {
  test('should return undefined when "obj" class and "objClass" matchs', async () => {
    const obj = new (class NewClass {})();
    const objClass = 'NewClass';
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';

    const expected = undefined;
    
    try {
      const received = throwIfIsNotClassOf(obj, objClass, errorMessage, statusCode);
      expect(received).toEqual(expected)
    } 
    catch (received) { 
      fail();
    }  
  })

  test('should return undefined when "obj" class and "objClass" does not match', async () => {
    const obj = new (class NewClass {})();
    const objClass = 'OtherClass';
    const errorMessage = 'errorMessage';
    const statusCode = 'statusCode';
    
      const expected = JSON.stringify({
        statusCode: 'statusCode',
        inputData: obj,
        errorMessage: 'errorMessage'
      });

      try {
        throwIfIsNotClassOf(obj, objClass, errorMessage, statusCode);
        fail();
      } 
      catch (received) { 
        expect(JSON.parse(received)).toEqual(JSON.parse(expected))
      }
  })
})