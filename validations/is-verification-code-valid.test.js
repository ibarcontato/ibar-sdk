
const isVerificationCodeValid = require('./is-verification-code-valid');

describe('function isVerificationCodeValid(code)', () => {
  test('should return true when code is valid', async () => {
    const code = 123456;

    const expected = true;
    const received = isVerificationCodeValid(code);

    expect(received).toEqual(expected)
  })

  test('should return false when code is invalid', async () => {
    const codes = ['123456', 123.456, 12.3456, 12.345, null, undefined, {}, [], true, 12345, 1234567, () => { }];
    const expected = false;
    for (let code in codes) {
      const received = isVerificationCodeValid(code);
  
      expect(received).toEqual(expected)
    }

  })
})