import { formatDate } from '.';
import dayjs from 'dayjs';

describe('formatDate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Даты', () => {
    test('Сегодняшняя дата', () => {
      const now = dayjs().hour(15).minute(30).second(0);
      const result = formatDate(dayjs(now).toISOString());

      expect(result).toBe('Сегодня, 15:30');
    });

    test('3 дня назад и более', () => {
      const now = dayjs().year(2025).month(11).date(15).hour(15).minute(20).second(0);
      const result = formatDate(dayjs(now).toISOString());

      expect(result).toBe('15.12.2025');
    });

    test('Будущая дата', () => {
      const now = dayjs().add(15, 'day').hour(15).minute(20).second(0);
      const result = formatDate(dayjs(now).toISOString());

      expect(result).toBe(now.format('DD.MM.YYYY'));
    });

    test('Формат string даты', () => {
      const now = dayjs().add(15, 'day').hour(15).minute(20).second(0);
      const result = formatDate(dayjs(now).toString());

      expect(result).toBe(now.format('DD.MM.YYYY'));
    });
  });

  describe('Время', () => {
    test('Полночь', () => {
      const now = dayjs().startOf('day');
      const result = formatDate(now.toISOString());

      expect(result).toBe('Сегодня, 00:00');
    });

    test('Полночь (00:01)', () => {
      const now = dayjs().startOf('day').add(1, 'minute');
      const result = formatDate(now.toISOString());

      expect(result).toBe('Сегодня, 00:01');
    });

    test('должен показывать время в 24-часовом формате', () => {
      const cases = [
        { hour: 9, minute: 5, expected: 'Сегодня, 09:05' },
        { hour: 14, minute: 30, expected: 'Сегодня, 14:30' },
        { hour: 23, minute: 45, expected: 'Сегодня, 23:45' },
      ];

      cases.forEach(({ hour, minute, expected }) => {
        const now = dayjs().hour(hour).minute(minute).toISOString();
        const result = formatDate(now);

        expect(result).toBe(expected);
      });
    });
  });
});
