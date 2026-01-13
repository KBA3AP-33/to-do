import { cleanPhoneNumber } from '.';

describe('cleanPhoneNumber', () => {
  describe('Базовые номера', () => {
    test('Удалить все нецифровые символы кроме плюса', () => {
      const cases = [
        { input: '+7 (123) 456-78-90', expected: '+71234567890' },
        { input: '8 (123) 456-78-90', expected: '81234567890' },
        { input: '123 456 7890', expected: '1234567890' },
        { input: '(123)456-7890', expected: '1234567890' },
        { input: 'тел.: +7 999 123-45-67', expected: '+79991234567' },
        { input: '123—456—7890', expected: '1234567890' },
      ];

      cases.forEach(({ input, expected }) => {
        expect(cleanPhoneNumber(input)).toBe(expected);
      });
    });

    test('Номера без плюса', () => {
      const cases = [
        { input: '81234567890', expected: '81234567890' },
        { input: '1234567890', expected: '1234567890' },
        { input: '88005553535', expected: '88005553535' },
      ];

      cases.forEach(({ input, expected }) => {
        expect(cleanPhoneNumber(input)).toBe(expected);
      });
    });
  });

  describe('Пустые значения', () => {
    test('undefined', () => {
      expect(cleanPhoneNumber(undefined)).toBeUndefined();
    });

    test('Пустая строка', () => {
      expect(cleanPhoneNumber('')).toBe('');
      expect(cleanPhoneNumber('   ')).toBe('');
    });

    test('null', () => {
      expect(cleanPhoneNumber(null as unknown as string)).toBeUndefined();
    });

    test('Нижнее подчеркивание', () => {
      const cases = [
        '123_456_7890',
        '+7_123_456_78_90',
        '_1234567890',
        '1234567890_',
        '123_456',
        '_',
        '__',
        '123 456_7890',
      ];

      cases.forEach(input => {
        expect(cleanPhoneNumber(input)).toBeNull();
      });
    });

    test('Только символы', () => {
      expect(cleanPhoneNumber('abc')).toBe('');
      expect(cleanPhoneNumber('!@#$%^&*()')).toBe('');
      expect(cleanPhoneNumber('  - () ')).toBe('');
    });
  });

  describe('Граничные случаи', () => {
    test('Длинный номер', () => {
      const longNumber = '+1' + '2'.repeat(50);
      const result = cleanPhoneNumber(longNumber);

      expect(result).toBe(longNumber);
    });

    test('Международные форматы', () => {
      const cases = [
        { input: '+1 (234) 567-8900', expected: '+12345678900' },
        { input: '+49 170 1234567', expected: '+491701234567' },
        { input: '+81 90-1234-5678', expected: '+819012345678' },
        { input: '+86 131 2345 6789', expected: '+8613123456789' },
      ];

      cases.forEach(({ input, expected }) => {
        expect(cleanPhoneNumber(input)).toBe(expected);
      });
    });
  });
});
