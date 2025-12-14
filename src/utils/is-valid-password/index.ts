const config = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  maxLength: 100,
};

export const errorsText = {
  empty: 'Пустое значение',
  minLength: `Минимальная длина: ${config.minLength} символов`,
  requireUppercase: 'Требуется хотя бы одна заглавная буква',
  requireLowercase: 'Требуется хотя бы одна строчная буква',
  requireNumbers: 'Требуется хотя бы одна цифра',
  maxLength: `Максимальная длина: ${config.maxLength} символов`,
};

export const isValidPassword = (password: string) => {
  const value = password.trim();
  const errors: string[] = [];
  if (!value) errors.push(errorsText.empty);
  if (value.length < config.minLength) errors.push(errorsText.minLength);
  if (value.length > config.maxLength) errors.push(errorsText.maxLength);
  if (config.requireUppercase && !/[A-ZА-Я]/.test(value)) errors.push(errorsText.requireUppercase);
  if (config.requireLowercase && !/[a-zа-я]/.test(value)) errors.push(errorsText.requireLowercase);
  if (config.requireNumbers && !/\d/.test(value)) errors.push(errorsText.requireNumbers);

  return errors;
};
