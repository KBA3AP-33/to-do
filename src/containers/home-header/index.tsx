import { Layout } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '@src/store';
import { Link } from 'react-router-dom';
import { ROUTES } from '@src/routes';
import { Logo } from '@src/components/logo';

const { Header } = Layout;

export const HomeHeader = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Header className="border-b-1 border-[#0505050f]">
      <div className="flex justify-between items-center px-4">
        <Logo />
        <Link to={user ? ROUTES.projects : ROUTES.login}>Войти</Link>
      </div>
    </Header>
  );
};
