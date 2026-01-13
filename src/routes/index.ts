export const ROUTES = {
  index: '/',
  projects: '/projects',
  projectsCompleted: '/projects-completed',
  statusProjects: (id: string) => `/projects/status/${id}`,
  projectsItem: (id: string) => `/projects/${id}`,
  login: '/login',
  registration: '/registration',
};
