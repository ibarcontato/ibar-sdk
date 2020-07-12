const throwErrorResponseModel = require('../throws/throw-error-response-model');

module.exports = function throwIfIsNotString(data, errorMessage, statusCode) {
  if (typeof data != 'string')
    throwErrorResponseModel(data, errorMessage, statusCode);
}  