const lambda = require('./invoke-lambda.mock');
const invokeLambda = require('./invoke-lambda');

describe('\n invokeLambda = async ({ lambda, functionName, stage = \'dev\', payload })', () => {
  test('should return success object when inputs are valid', async () => {
    const functionName = 'functionName';

    const expected = {};

    const received = await invokeLambda({ lambda: lambda, functionName: functionName })
      .catch(received => {
        fail();
        return received
      });
    expect(received).toEqual(expected);
  })

  test('should return error object when lambda is not valid', async () => {
    const lambda = undefined;
    const functionName = 'functionName';

    const expected = {
      statusCode: 400,
      inputData: {
        FunctionName: functionName,
        Qualifier: 'dev',
      }
    };

    await invokeLambda({ lambda: lambda, functionName: functionName })
      .then(received => { fail(); return received })
      .catch(received => {
        const receivedParsed = JSON.parse(received);
        receivedParsed.errorMessage = undefined;
        expect(receivedParsed).toEqual(expected)
      });
  })

  test('should return error object when functionName is not valid', async () => {
    const functionName = 'FORCE_FUNCTION_ERROR';

    const expected = {
      statusCode: 400,
      inputData: {
        FunctionName: functionName,
        Qualifier: 'dev',
      }
    };

    await invokeLambda({ lambda: lambda, functionName: functionName })
      .then(received => { fail(); return received }) 
      .catch(received => {
        const receivedParsed = JSON.parse(received);
        receivedParsed.errorMessage = undefined;
        expect(receivedParsed).toEqual(expected)
      });
  })
})

