exports.models = {
  SuccessResponseModel: require('./models/success-response-model'),
  ErrorResponseModel: require('./models/error-response-model')
}

exports.validations = {
  isObject: require('./validations/is-object'),
  isEmptyObject: require('./validations/is-empty-object'),
  isEmailValid: require('./validations/is-email-valid'),
  isVerificationCodeValid: require('./validations/is-verification-code-valid'),
  isClassOf: require('./validations/is-class-of'),
}

exports.utils = {
  mergeObjects: require('./utils/merge-objects'),
  throwErrorResponseModel: require('./utils/throw-error-response-model'),
  debugResult: require('./utils/debug-result')
}

exports.database = {
  dbGateway: require('./database/db-gateway')
}

