const isEmailValid  = require('./is-email-valid')

describe('function isEmailValid(email)', () => {
  test('should return true when email is valid', async () => {
    const expected = true;
    const emails = ['a@b.cc', 'a@b.cc.dd', 'a1@b.cc'];

    for (let email of emails) {
      const received = isEmailValid(email);
      expect(received).toEqual(expected);
    }

  });

  test('should return false when email is invalid', async () => {
    const expected = false;
    const emails = ['ab.cc.dd', undefined, null, 1, true, [], {}, () => {}];

    for (let email of emails) {
      const received = isEmailValid(email);
      expect(received).toEqual(expected);
    }
  });
})