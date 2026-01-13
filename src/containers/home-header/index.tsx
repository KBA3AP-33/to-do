import { Flex, Layout } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '@src/store';
import { Link } from 'react-router-dom';
import { ROUTES } from '@src/routes';
import { Logo } from '@src/components/logo';
import { ThemeSwitcher } from '../theme-switcher';

const { Header } = Layout;

export const HomeHeader = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Header className="border-b-1 border-[#0505050f]">
      <Flex justify="space-between" align="center" className="!px-4">
        <Logo />
        <Flex align="center" gap={16}>
          <ThemeSwitcher />
          <Link to={user ? ROUTES.projects : ROUTES.login}>Войти</Link>
        </Flex>
      </Flex>
    </Header>
  );
};
