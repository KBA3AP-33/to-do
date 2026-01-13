import { ErrorPage } from '@src/pages/error';
import { routes } from '@src/routes/config';
import { useMemo } from 'react';
import { createBrowserRouter, createHashRouter } from 'react-router-dom';

export const useRouter = () => {
  return useMemo(() => {
    const routerConfig = routes.map(x => ({
      ...x,
      ErrorBoundary: ErrorPage,
    }));

    const isGitHubPages = window.location.hostname.includes('github.io');

    if (isGitHubPages) {
      return createHashRouter(routerConfig);
    }

    return createBrowserRouter(routerConfig);
  }, []);
};
