import { phoneNumberFormat } from '.';

describe('phoneNumberFormat', () => {
  describe('Базовые случаи', () => {
    test('Должен вернуть номер с плюсом', () => {
      const mask = '+0 (000) 000-00-00';
      const phone = '79161234567';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('+7 (916) 123-45-67');
    });

    test('Должен вернуть номер без плюса', () => {
      const mask = '0 (000) 000-00-00';
      const phone = '91612345678';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('9 (161) 234-56-78');
    });
  });

  describe('Неполные номера', () => {
    test('Должен заменить недостающие цифры - подчеркиванием', () => {
      const mask = '+0 (000) 000-00-00';
      const phone = '79161';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('+7 (916) 1__-__-__');
    });

    test('Должен заменить недостающие цифры (Пустая строка) - подчеркиванием', () => {
      const mask = '+0 (000) 000-00-00';
      const phone = '';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('+_ (___) ___-__-__');
    });
  });

  describe('Длинные номера', () => {
    test('Должен использовать только нужное количество цифр', () => {
      const mask = '+0 (000) 000-00-00';
      const phone = '791612345678901234';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('+7 (916) 123-45-67');
    });

    test('Должен использовать только нужное количество цифр (короткий номер)', () => {
      const mask = '000-00';
      const phone = '123456789';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('123-45');
    });
  });

  describe('Форматы масок', () => {
    test('Должен корректно заменять символы (простая)', () => {
      const mask = '0000000000';
      const phone = '1234567890';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('1234567890');
    });

    test('Должен корректно заменять символы (без нулей)', () => {
      const mask = '+ () -';
      const phone = '';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('+ () -');
    });

    test('Должен сохранить все кроме нулей', () => {
      const mask = '+0 (000) 000-00-00 [доб. 000]';
      const phone = '79161234567123';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('+7 (916) 123-45-67 [доб. 123]');
    });

    test('Должен вернуть пустую строку (пустая маска)', () => {
      const mask = '';
      const phone = '1234567890';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('');
    });

    test('Должен вернуть пустую строку (пустой номер)', () => {
      const mask = '+0 (000) 000-00-00';
      const phone = '';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('+_ (___) ___-__-__');
    });

    test('Должен корректно заменять символы (длинная маска)', () => {
      const mask = '0'.repeat(100);
      const phone = '1'.repeat(50);
      const result = phoneNumberFormat(mask, phone);

      expect(result.slice(0, 50)).toBe('1'.repeat(50));
      expect(result.slice(50, 100)).toBe('_'.repeat(50));
    });

    test('Должен корректно заменять символы (длинный номер)', () => {
      const mask = '000-000';
      const phone = '1'.repeat(100);
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('111-111');
    });
  });

  describe('Специальные символы', () => {
    test('Должен сохранить все кроме нулей', () => {
      const mask = '0!0@0#0$0%0^0&0*0(0)0';
      const phone = '12345678901';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('1!2@3#4$5%6^7&8*9(0)1');
    });

    test('Пробелы и табуляции', () => {
      const mask = '0 0\t0\n0';
      const phone = '1234';
      const result = phoneNumberFormat(mask, phone);

      expect(result).toBe('1 2\t3\n4');
    });
  });
});
