import type { Rule } from 'antd/es/form';
import { validator } from '.';

describe('validator', () => {
  const mockRule = {} as Rule;

  describe('email', () => {
    test('Должен не возвращать ошибок', async () => {
      const result = await validator.email(mockRule, 'test@example.com');
      expect(result).toBeUndefined();
    });

    test('Должен вернуть ошибку не валидного email', async () => {
      await expect(validator.email(mockRule, 'invalid-email')).rejects.toBe('Введите корректный email');
    });

    test('Должен вернуть ошибку не валидного (пустого) email', async () => {
      await expect(validator.email(mockRule, '')).rejects.toBe('Введите корректный email');
    });
  });

  describe('password', () => {
    test('Должен не возвращать ошибок', async () => {
      const result = await validator.password(mockRule, 'csdcdsS154');
      expect(result).toBeUndefined();
    });

    test('Должен вернуть ошибку не валидного пароля (мин. длина)', async () => {
      await expect(validator.password(mockRule, 'vdfv')).rejects.toContain('Минимальная длина: 8 символов');
    });

    test('Должен вернуть ошибку не валидного (пустого) пароля', async () => {
      await expect(validator.password(mockRule, '')).rejects.toContain('Пустое значение');
    });
  });

  describe('confirm', () => {
    test('Должен не возвращать ошибок', async () => {
      const result = await validator.confirmPassword(mockRule, 'password123', 'password123');
      expect(result).toBeUndefined();
    });

    test('Должен вернуть ошибку - Пароли не совпадают', async () => {
      await expect(validator.confirmPassword(mockRule, 'password1', 'password2')).rejects.toBe('Пароли не совпадают');
    });
  });
});
