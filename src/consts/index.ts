export const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';

export const priorities = [
  { value: '0', color: 'red' },
  { value: '1', color: 'orange' },
  { value: '2', color: 'yellow' },
  { value: '3', color: 'blue' },
  { value: '4', color: 'green' },
];

export const API_ROUTES = {
  UPLOAD: 'upload',
  PROJECTS: 'projects',
  TASKS: 'tasks',
};

export const QUERY_KEYS = {
  UPLOAD: 'upload',
  PROJECTS: 'projects',
  TASKS: 'tasks',
};
