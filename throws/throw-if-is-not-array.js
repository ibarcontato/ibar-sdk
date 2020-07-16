const isArray = require("../validations/is-array")
const throwErrorResponseModel = require('./throw-error-response-model');

module.exports = function throwIfIsNotArray(array, errorMessage, statusCode) {
  if (!isArray(array))
    throwErrorResponseModel(array, errorMessage, statusCode)

}