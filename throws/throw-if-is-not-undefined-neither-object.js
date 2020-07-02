const throwErrorResponseModel = require('../utils/throw-error-response-model');
const isObject = require('../validations/is-object');

module.exports = function throwIfIsNotUndefinedNeitherObject(data, errorMessage, statusCode) {
  if (!(isObject(data) || data === undefined))
    throwErrorResponseModel(data, errorMessage, statusCode);
}  