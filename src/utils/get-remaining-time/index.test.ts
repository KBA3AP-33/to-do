import dayjs from 'dayjs';
import { getRemainingTime } from '.';

jest.mock('../plural', () => ({
  plural: jest.fn().mockImplementation((value: number, variants: { [key in Intl.LDMLPluralRule]?: string }) => {
    const key = new Intl.PluralRules('ru').select(value);
    return value + ' ' + (variants[key] ?? '');
  }),
}));

describe('getRemainingTime', () => {
  describe('Интервалы', () => {
    test('Года', () => {
      const now = dayjs().year(2025);
      const date = dayjs().year(2028).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 3 года');
    });

    test('Дни', () => {
      const now = dayjs().year(2025).month(0).date(5);
      const date = dayjs().year(2025).month(0).date(15).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 10 дней');
    });

    test('Часы', () => {
      const now = dayjs().year(2025).month(0).date(5).hour(12);
      const date = dayjs().year(2025).month(0).date(5).hour(22).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 10 часов');
    });

    test('Осталось менее часа', () => {
      const now = dayjs().year(2025).month(0).date(5).hour(12).minute(20);
      const date = dayjs().year(2025).month(0).date(5).hour(12).minute(30).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось менее часа');
    });

    test('Время истекло', () => {
      const now = dayjs().year(2026);
      const date = dayjs().year(2025).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Время истекло');
    });
  });

  describe('plural', () => {
    test('1 год', () => {
      const now = dayjs().year(2025);
      const date = dayjs().year(2026).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Остался 1 год');
    });

    test('2 года', () => {
      const now = dayjs().year(2025);
      const date = dayjs().year(2027).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 2 года');
    });

    test('5 лет', () => {
      const now = dayjs().year(2025);
      const date = dayjs().year(2030).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 5 лет');
    });

    test('1 день', () => {
      const now = dayjs().year(2025).month(0).date(5);
      const date = dayjs().year(2025).month(0).date(6).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Остался 1 день');
    });

    test('2 дня', () => {
      const now = dayjs().year(2025).month(0).date(5);
      const date = dayjs().year(2025).month(0).date(7).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 2 дня');
    });

    test('5 дней', () => {
      const now = dayjs().year(2025).month(0).date(5);
      const date = dayjs().year(2025).month(0).date(10).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 5 дней');
    });

    test('1 час', () => {
      const now = dayjs().year(2025).month(0).date(5).hour(12);
      const date = dayjs().year(2025).month(0).date(5).hour(13).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Остался 1 час');
    });

    test('2 час', () => {
      const now = dayjs().year(2025).month(0).date(5).hour(12);
      const date = dayjs().year(2025).month(0).date(5).hour(14).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 2 часа');
    });

    test('5 часов', () => {
      const now = dayjs().year(2025).month(0).date(5).hour(12);
      const date = dayjs().year(2025).month(0).date(5).hour(17).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось 5 часов');
    });
  });

  describe('Граничные случаи', () => {
    test('Точное совпадение времени', () => {
      const now = dayjs().year(2025).month(0).date(5).hour(12).minute(30).second(45).millisecond(500);
      const date = dayjs().year(2025).month(0).date(5).hour(12).minute(30).second(45).millisecond(500).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось менее часа');
    });

    test('59 минут', () => {
      const now = dayjs().year(2025).month(0).date(5).hour(12).minute(30);
      const date = dayjs().year(2025).month(0).date(5).hour(13).minute(29).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Осталось менее часа');
    });

    test('60+ минут', () => {
      const now = dayjs().year(2025).month(0).date(5).hour(12).minute(30);
      const date = dayjs().year(2025).month(0).date(5).hour(13).minute(31).toISOString();

      const result = getRemainingTime(date, now);
      expect(result).toBe('Остался 1 час');
    });
  });
});
