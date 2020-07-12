const  throwErrorResponseModel = require('./throw-error-response-model');
const  ErrorResponseModel  = require('../models/error-response-model');

describe('throwErrorResponseModel = (inputData, errorMessage, statusCode = 400)', () => {
  test('should return success object', async () => {
    const inputData = 'inputData';
    const errorMessage = 'errorMessage';
    const statusCodes = ['statusCode', undefined];

    for (let statusCode of statusCodes) {
      const expected = JSON.stringify({
        inputData: 'inputData',
        errorMessage: 'errorMessage',
        statusCode: statusCode ? statusCode : 400
      });
      try { throwErrorResponseModel(inputData, errorMessage, statusCode) } catch (received) { expect(received).toEqual(expected) }
    }
  });
})



