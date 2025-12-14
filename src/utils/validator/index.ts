import type { Rule } from 'antd/es/form';
import { isValidEmail } from '../is-valid-email';
import { isValidPassword } from '../is-valid-password';

export const validator = {
  email: (_: Rule, value: string) => {
    if (!value || !isValidEmail(value)) {
      return Promise.reject('Введите корректный email');
    }
    return Promise.resolve();
  },
  password: (_: Rule, value: string) => {
    const errors = isValidPassword(value);
    if (errors.length) {
      return Promise.reject(errors);
    }
    return Promise.resolve();
  },
  confirmPassword: (_: Rule, value: string, password: string) => {
    if (value !== password) {
      return Promise.reject('Пароли не совпадают');
    }
    return Promise.resolve();
  },
};
