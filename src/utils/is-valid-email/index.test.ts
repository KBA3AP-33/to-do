import { isValidEmail } from '.';
import { REGEX_EMAIL } from '@src/consts';

describe('REGEX_EMAIL', () => {
  test('Должен вернуть true - Валидные', () => {
    expect(REGEX_EMAIL.test('test@example.com')).toBe(true);
    expect(REGEX_EMAIL.test('user.name@domain.co')).toBe(true);
    expect(REGEX_EMAIL.test('user_name@domain.org')).toBe(true);
  });

  test('Должен вернуть false - Невалидные', () => {
    expect(REGEX_EMAIL.test('invalid-email')).toBe(false);
    expect(REGEX_EMAIL.test('@domain.com')).toBe(false);
    expect(REGEX_EMAIL.test('user@')).toBe(false);
  });
});

describe('isValidEmail', () => {
  describe('Должен вернуть true - Валидные', () => {
    const validEmails = [
      'simple@example.com',
      'very.common@example.com',
      'disposable.style.email.with+symbol@example.com',
      'other.email-with-hyphen@example.com',
      'fully-qualified-domain@example.com',
      'user_name@example.com',
      'user.name@example.com',
      'user.name.last@example.com',
      'user123@example.com',
      '123user@example.com',
      'user123@example123.com',
      'email@subdomain.example.com',
      'email@example-one.com',
      'email@example.name',
      'email@example.museum',
      'email@example.co.jp',
      'user+tag@example.com',
      'user%name@example.com',
      'user-name@example.com',
      'user_name@example.com',
      'user.name@example.com',
      'a@b.cd',
      'test@ab.cd',
      'email@example.verylongtld',
      'email@example.verylongdomainname',
      'EMAIL@EXAMPLE.COM',
      'FirstName.LastName@Example.com',
      'User@Example.COM',
    ];

    validEmails.forEach(email => {
      test(`Валидный: ${email}`, () => {
        expect(isValidEmail(email)).toBe(true);
      });
    });
  });

  describe('Должен вернуть false - Невалидные', () => {
    const invalidEmails = [
      'email.example.com',
      'A@b@c@example.com',
      'email@example@example.com',
      'email @example.com',
      'email@ example.com',
      'email@example .com',
      'email@.com',
      'email@example.',
      'email@example.c',
      'email@example.a',
      'email@example_website.com',
      'email@example+website.com',
      'email@example#website.com',
      'email@example&website.com',
      'email@com',
      'email@localhost',
    ];

    invalidEmails.forEach(email => {
      test(`Невалидный: "${email}"`, () => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('С пробелами', () => {
    test('Должен корректно работать с пробелами', () => {
      expect(isValidEmail('  test@example.com  ')).toBe(true);
      expect(isValidEmail('\ttest@example.com\n')).toBe(true);
      expect(isValidEmail(' \n test@example.com \t ')).toBe(true);
    });

    test('Должен корректно работать с пустыми строками', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('   ')).toBe(false);
      expect(isValidEmail('\t\n')).toBe(false);
    });

    test('Должен корректно работать с заглавными буквами', () => {
      expect(isValidEmail('test@EXAMPLE.COM')).toBe(true);
      expect(isValidEmail('test@Example.Com')).toBe(true);
      expect(isValidEmail('TEST@example.com')).toBe(true);
    });
  });
});
