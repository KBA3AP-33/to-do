export const plural = (value: number, variants: { [key in Intl.LDMLPluralRule]?: string }, locale = 'ru') => {
  const key = new Intl.PluralRules(locale).select(value);
  return value + ' ' + (variants[key] ?? '');
};
