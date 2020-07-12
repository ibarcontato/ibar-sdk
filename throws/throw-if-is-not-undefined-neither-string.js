const throwErrorResponseModel = require('../throws/throw-error-response-model');

module.exports = function throwIfIsNotUndefinedNeitherString(data, errorMessage, statusCode) {
  if (!(typeof data === 'string' || data === undefined))
    throwErrorResponseModel(data, errorMessage, statusCode);
}  