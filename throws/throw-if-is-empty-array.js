const isEmptyArray = require("../validations/is-empty-array")
const throwErrorResponseModel = require('./throw-error-response-model');

module.exports = function throwIfIsEmptyArray(array, errorMessage, statusCode) {
  if (isEmptyArray(array))
      throwErrorResponseModel(array, errorMessage, statusCode)

} 