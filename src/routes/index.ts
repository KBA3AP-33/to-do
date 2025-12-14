export const ROUTES = {
  index: '/',
  projects: '/projects',
  statusProjects: (id: string) => `/projects/status/${id}`,
  projectsItem: '/projects/:id',
  login: '/login',
  registration: '/registration',
};
