module.exports = function isArray(array) {
  return array != null && typeof array == 'object' && array.length !== undefined;
}