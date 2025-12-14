import { ErrorPage } from '@src/pages/error';
import { routes } from '@src/routes/config';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router-dom';

export const useRouter = () => {
  return useMemo(
    () =>
      createBrowserRouter(
        routes.map(x => ({
          ...x,
          ErrorBoundary: ErrorPage,
        }))
      ),
    []
  );
};
