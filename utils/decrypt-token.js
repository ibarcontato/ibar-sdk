const throwErrorResponseModel = require('../throws/throw-error-response-model')
const CryptoJS = require('crypto-js');

module.exports = function decryptToken(token, tokenSecret) {
  try {
    const decryptedToken = CryptoJS.AES.decrypt(token, tokenSecret).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedToken);
  } catch (err) {
    throwErrorResponseModel(token, 'Could not decrypt token. ' + err.message);
  }
} 