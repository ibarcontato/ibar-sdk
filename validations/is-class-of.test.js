
const isClassOf = require('./is-class-of');

const newClass = class NewClass {};
const obj = new newClass();

describe('function isClassOf(obj, className)', () => {
  test('should return true when obj class and className matchs', async () => {
    const className = 'NewClass';

    const expected = true;
    const received = isClassOf(obj, className);

    expect(received).toEqual(expected)
  })

  test('should return false when obj class and className does not match', async () => {
    const classNames = [newClass, '1', 11, null, undefined, {}, [], true, () => { }];
    
    const expected = false;
    for (let className in classNames) {
      const received = isClassOf(obj, className);
  
      expect(received).toEqual(expected)
    }
  })
})