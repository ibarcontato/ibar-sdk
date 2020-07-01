const isObject = require("../validations/is-object")
const throwErrorResponseModel = require('../utils/throw-error-response-model');

module.exports = function throwIfIsNotObject(obj, errorMessage, statusCode) {
  if (!isObject(obj))
    throwErrorResponseModel(obj, errorMessage, statusCode)

}