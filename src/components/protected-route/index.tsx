import { ROUTES } from '@src/routes';
import type { RootState } from '@src/store';
import type { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Loader } from '@src/components/loader';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
  const { isLoading, user } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center">
        <Loader loading />
      </div>
    );
  }

  if (!user) {
    if (window.location.pathname !== ROUTES.login) {
      return <Navigate to={ROUTES.login} replace />;
    }
  }

  return <>{children}</>;
};
