const  ErrorResponseModel  = require('../models/error-response-model');

module.exports = function throwErrorResponseModel(inputData, errorMessage, statusCode = 400)  {
  throw JSON.stringify(new ErrorResponseModel(inputData, errorMessage, statusCode));
}  