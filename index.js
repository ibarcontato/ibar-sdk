exports.models = {
  SuccessResponseModel: require('./models/success-response-model'),
  ErrorResponseModel: require('./models/error-response-model')
}

exports.validations = {
  isObject: require('./validations/is-object'),
  isArray: require('./validations/is-array'),
  isEmptyObject: require('./validations/is-empty-object'),
  isEmptyArray: require('./validations/is-empty-array'),
  isEmailValid: require('./validations/is-email-valid'),
  isVerificationCodeValid: require('./validations/is-verification-code-valid'),
  isClassOf: require('./validations/is-class-of'),
}

exports.utils = {
  mergeObjects: require('./utils/merge-objects'),
  debugResult: require('./utils/debug-result'),
  invokeLambda: require('./utils/invoke-lambda'),
  decryptToken: require('./utils/decrypt-token')
}

exports.database = {
  dbGateway: require('./database/db-gateway')
}

exports.throws = {
  throwErrorResponseModel: require('./throws/throw-error-response-model'),
  throwIfIsNotObject: require('./throws/throw-if-is-not-object'),
  throwIfIsNotArray: require('./throws/throw-if-is-not-array'),
  throwIfIsNotClassOf: require('./throws/throw-if-is-not-class-of'),
  throwIfIsNotString: require('./throws/throw-if-is-not-string'),
  throwIfIsEmptyObject: require('./throws/throw-if-is-empty-object'),
  throwIfIsEmptyArray: require('./throws/throw-if-is-empty-array'),
  throwIfIsNotUndefinedNeitherObject: require('./throws/throw-if-is-not-undefined-neither-object'),
  throwIfIsNotUndefinedNeitherString: require('./throws/throw-if-is-not-undefined-neither-string'),
}

