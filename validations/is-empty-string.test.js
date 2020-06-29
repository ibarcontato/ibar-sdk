const { isEmptyString } = require('./is-empty-string');

describe('isEmptyString = (string)', () => {
  test('should return true when string is an empty', async () => {
    const expected = true;
    const string = '';

    const received = isEmptyString(string);
    expect(received).toEqual(expected);
  });

  test('should return false when string is not empty', async () => {
    const expected = false;
    const notEmptyString = 'a';

    const received = isEmptyString(notEmptyString);
    expect(received).toEqual(expected);
  });
})