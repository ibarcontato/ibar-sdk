module.exports = function isVerificationCodeValid(code) {
  return typeof code == 'number' && !('' + code).includes('.') && ('' + code).length == 6
}