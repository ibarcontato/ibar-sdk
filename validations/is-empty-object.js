const isObject = require('./is-object');

module.exports = function isEmptyObject(object) {
  return isObject(object) && Object.keys(object).length === 0;
}