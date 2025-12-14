import type { Rule } from 'antd/es/form';
import { validator } from '.';

describe('validator', () => {
  const mockRule = {} as Rule;

  describe('email', () => {
    test('Валидный email', async () => {
      const result = await validator.email(mockRule, 'test@example.com');
      expect(result).toBeUndefined();
    });

    test('Невалидный email', async () => {
      await expect(validator.email(mockRule, 'invalid-email')).rejects.toBe('Введите корректный email');
    });

    test('Пустой email', async () => {
      await expect(validator.email(mockRule, '')).rejects.toBe('Введите корректный email');
    });
  });

  describe('password', () => {
    test('Валидный пароль', async () => {
      const result = await validator.password(mockRule, 'csdcdsS154');
      expect(result).toBeUndefined();
    });

    test('Слабый пароль', async () => {
      await expect(validator.password(mockRule, 'vdfv')).rejects.toContain('Минимальная длина: 8 символов');
    });

    test('Пустой пароль', async () => {
      await expect(validator.password(mockRule, '')).rejects.toContain('Пустое значение');
    });
  });

  describe('confirm', () => {
    test('Совпадающие пароли', async () => {
      const result = await validator.confirmPassword(mockRule, 'password123', 'password123');
      expect(result).toBeUndefined();
    });

    test('Несовпадающие пароли', async () => {
      await expect(validator.confirmPassword(mockRule, 'password1', 'password2')).rejects.toBe('Пароли не совпадают');
    });
  });
});
