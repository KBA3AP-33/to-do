import { isValidPassword, errorsText } from '.';

describe('isValidPassword', () => {
  const { empty, minLength, requireUppercase, requireLowercase, requireNumbers, maxLength } = errorsText;

  describe('Валидные', () => {
    test('Должен не возвращать ошибок', () => {
      expect(isValidPassword('Password123')).toEqual([]);
      expect(isValidPassword('Пароль123')).toEqual([]);
      expect(isValidPassword('Pass1234')).toEqual([]);
      expect(isValidPassword('A'.repeat(98) + 'a1')).toEqual([]);
    });
  });

  describe('Невалидные', () => {
    test('Должен вернуть все ошибки', () => {
      expect(isValidPassword('')).toEqual([empty, minLength, requireUppercase, requireLowercase, requireNumbers]);
      expect(isValidPassword('   ')).toEqual([empty, minLength, requireUppercase, requireLowercase, requireNumbers]);
    });

    test('Должен вернуть ошибку - Короткий пароль', () => {
      expect(isValidPassword('Pass12')).toEqual([minLength]);
    });

    test('Должен вернуть ошибку - Длинный пароль', () => {
      expect(isValidPassword('A'.repeat(101) + 'a1')).toEqual([maxLength]);
    });

    test('Должен вернуть ошибку - Без заглавных', () => {
      expect(isValidPassword('password123')).toEqual([requireUppercase]);
    });

    test('Должен вернуть ошибку - Без строчных', () => {
      expect(isValidPassword('PASSWORD123')).toEqual([requireLowercase]);
    });

    test('Должен вернуть ошибку - Без цифр', () => {
      expect(isValidPassword('Password')).toEqual([requireNumbers]);
    });

    test('Должен вернуть ошибку - Только цифры и Без строчных', () => {
      expect(isValidPassword('12345678')).toEqual([requireUppercase, requireLowercase]);
    });
  });
});
