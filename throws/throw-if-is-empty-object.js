const isEmptyObject = require("../validations/is-empty-object")
const throwErrorResponseModel = require('../utils/throw-error-response-model');

module.exports = function throwIfIsEmptyObject(obj, errorMessage, statusCode) {
  if (isEmptyObject(obj))
      throwErrorResponseModel(obj, errorMessage, statusCode)

} 