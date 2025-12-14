import { ROUTES } from '.';
import { MainPage } from '../pages/main';
import { ProjectsPage } from '@src/pages/projects';
import { LoginPage } from '@src/pages/login';
import { ProjectItemPage } from '@src/pages/project-item';
import { RegistrationPage } from '@src/pages/registration';
import { Error404Page } from '@src/pages/error-404';
import { TasksPage } from '@src/pages/tasks';

export const routes = [
  { path: ROUTES.index, Component: MainPage },
  { path: ROUTES.projects, Component: ProjectsPage },
  { path: ROUTES.projectsItem, Component: ProjectItemPage },
  { path: ROUTES.login, Component: LoginPage },
  { path: ROUTES.registration, Component: RegistrationPage },
  { path: ROUTES.statusProjects(':status'), Component: TasksPage },
  { path: '*', Component: Error404Page },
];
