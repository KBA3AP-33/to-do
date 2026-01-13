import { ROUTES } from '.';
import { MainPage } from '../pages/main';
import { ProjectsPage } from '@src/pages/projects';
import { LoginPage } from '@src/pages/login';
import { ProjectItemPage } from '@src/pages/project-item';
import { RegistrationPage } from '@src/pages/registration';
import { Error404Page } from '@src/pages/error-404';
import { TasksPage } from '@src/pages/tasks';
import { ProjectCompletedPage } from '@src/pages/project-completed-page';

export const routes = [
  { path: ROUTES.index, element: <MainPage /> },
  { path: ROUTES.projects, element: <ProjectsPage /> },
  { path: ROUTES.projectsCompleted, element: <ProjectCompletedPage /> },
  { path: ROUTES.projectsItem(':id'), element: <ProjectItemPage /> },
  { path: ROUTES.login, element: <LoginPage /> },
  { path: ROUTES.registration, element: <RegistrationPage /> },
  { path: ROUTES.statusProjects(':status'), element: <TasksPage /> },
  { path: '*', element: <Error404Page /> },
];
