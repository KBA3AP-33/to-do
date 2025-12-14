import { REGEX_EMAIL } from '../../consts';

export const isValidEmail = (email: string) => {
  const value = email.trim();
  if (!value) return false;

  return REGEX_EMAIL.test(value);
};
