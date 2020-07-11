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
  debugResult: require('./utils/debug-result'),
  invokeLambda: require('./utils/invoke-lambda')
}

exports.database = {
  dbGateway: require('./database/db-gateway')
}

exports.throws = {
  throwIfIsNotObject: require('./throws/throw-if-is-not-object'),
  throwIfIsNotClassOf: require('./throws/throw-if-is-not-class-of'),
  throwIfIsNotString: require('./throws/throw-if-is-not-string'),
  throwIfIsEmptyObject: require('./throws/throw-if-is-empty-object'),
  throwIfIsNotUndefinedNeitherObject: require('./throws/throw-if-is-not-undefined-neither-object'),
  throwIfIsNotUndefinedNeitherString: require('./throws/throw-if-is-not-undefined-neither-string')
}

