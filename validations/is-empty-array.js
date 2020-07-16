const isArray = require('./is-array');

module.exports = function isEmptyArray(array) {
  return isArray(array) && array.length === 0;
}