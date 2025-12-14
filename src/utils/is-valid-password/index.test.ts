import { isValidPassword, errorsText } from '.';

describe('isValidPassword', () => {
  const { empty, minLength, requireUppercase, requireLowercase, requireNumbers, maxLength } = errorsText;

  describe('Валидные', () => {
    test('Корректный пароль', () => {
      expect(isValidPassword('Password123')).toEqual([]);
      expect(isValidPassword('Пароль123')).toEqual([]);
      expect(isValidPassword('Pass1234')).toEqual([]);
      expect(isValidPassword('A'.repeat(98) + 'a1')).toEqual([]);
    });
  });

  describe('Невалидные', () => {
    test('Пустой пароль', () => {
      expect(isValidPassword('')).toEqual([empty, minLength, requireUppercase, requireLowercase, requireNumbers]);
      expect(isValidPassword('   ')).toEqual([empty, minLength, requireUppercase, requireLowercase, requireNumbers]);
    });

    test('Короткий пароль', () => {
      expect(isValidPassword('Pass12')).toEqual([minLength]);
    });

    test('Длинный пароль', () => {
      expect(isValidPassword('A'.repeat(101) + 'a1')).toEqual([maxLength]);
    });

    test('Без заглавных', () => {
      expect(isValidPassword('password123')).toEqual([requireUppercase]);
    });

    test('Без строчных', () => {
      expect(isValidPassword('PASSWORD123')).toEqual([requireLowercase]);
    });

    test('Без цифр', () => {
      expect(isValidPassword('Password')).toEqual([requireNumbers]);
    });

    test('Только цифры', () => {
      expect(isValidPassword('12345678')).toEqual([requireUppercase, requireLowercase]);
    });
  });
});
