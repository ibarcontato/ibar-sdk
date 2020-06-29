module.exports = function isClassOf(obj, className) {
  try {
    return obj.constructor.name == className;
  } catch (_) {
    return false;
  }
}