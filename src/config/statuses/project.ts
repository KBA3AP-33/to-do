import type { StatusData } from './types';

export enum ProjectStatus {
  COMPLETED = 'COMPLETED',
  WORK = 'WORK',
  EMPTY = 'EMPTY',
}

export const statuses: Record<ProjectStatus, StatusData> = {
  [ProjectStatus.COMPLETED]: { color: 'green', title: 'Завершено' },
  [ProjectStatus.WORK]: { color: 'orange', title: 'В работе' },
  [ProjectStatus.EMPTY]: { color: 'red', title: 'Нет задач' },
};
