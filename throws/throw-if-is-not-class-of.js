const isClassOf = require("../validations/is-class-of")
const throwErrorResponseModel = require('../utils/throw-error-response-model');

module.exports = function throwIfIsNotClassOf(obj, objClass, errorMessage, statusCode) {
  if (!isClassOf(obj, objClass)) {
    throwErrorResponseModel(obj, errorMessage, statusCode)
  } 
}  