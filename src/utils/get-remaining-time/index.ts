import dayjs, { Dayjs } from 'dayjs';
import { plural } from '../plural';

export const getRemainingTime = (date: string, now: Dayjs = dayjs()) => {
  const target = dayjs(date);

  const getText = (value: number) => plural(value, { one: 'Остался', few: 'Осталось', many: 'Осталось' }).split(' ')[1];

  const years = target.diff(now, 'year');
  if (years > 0) return `${getText(years)} ${plural(years, { one: 'год', few: 'года', many: 'лет' })}`;

  const days = target.diff(now, 'day');
  if (days > 0) return `${getText(days)} ${plural(days, { one: 'день', few: 'дня', many: 'дней' })}`;

  const hours = target.diff(now, 'hour');
  if (hours > 0) return `${getText(hours)} ${plural(hours, { one: 'час', few: 'часа', many: 'часов' })}`;

  return target.isBefore(now) ? 'Время истекло' : 'Осталось менее часа';
};
