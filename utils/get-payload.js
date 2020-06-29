const  ErrorResponseModel  = require('../models/error-response-model');

exports.getPayload = (result) => {
  if (result.Payload && typeof result.Payload == 'string') {
    result.Payload = JSON.parse(result.Payload);
  }
  if (result.Payload && result.Payload.errorMessage) {
    const { inputData, errorMessage, statusCode } = result.Payload;
    return new ErrorResponseModel(inputData, errorMessage, statusCode);
  }
  const payload = result.Payload.payload;
  return payload;
}