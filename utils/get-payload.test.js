const { getPayload } = require('./get-payload');

describe('getPayload = (result)', () => {
  test('should return payload object when result has "Payload.errorMessage" attribute', async () => {
    const result = { Payload: JSON.stringify({ payload: {} }) };

    const expected = {};

    const received = getPayload(result);
    expect(received).toEqual(expected);
  })

  test('should return an error object when result has no "Payload.errorMessage" attribute', async () => {
    const result = {
      Payload: JSON.stringify({
        errorMessage: 'errorMessage',
        statusCode: 0,
        inputData: {}
      }),

    };

    const expected = {
      statusCode: 0,
      errorMessage: 'errorMessage',
      inputData: {}
    };

    const received = getPayload(result);
    expect(received).toEqual(expected);
  })
})

