import dayjs from 'dayjs';

export const formatDate = (date: string) => {
  const target = dayjs(date);
  const diff = dayjs().diff(target, 'day');

  if (diff === 0) return `Сегодня, ${target.format('HH:mm')}`;
  if (diff === 1) return `Вчера, ${target.format('HH:mm')}`;

  return target.format('DD.MM.YYYY');
};
