import { useState } from 'react';
import { ROUTES } from '@src/routes';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@src/store';
import { Avatar, Dropdown, Flex, Layout, type MenuProps, Space } from 'antd';
import { AuditOutlined, DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { BreadCrumbNav } from '@src/containers/bread-crumb-nav';
import { logout, profile } from '@src/store/auth/slice';
import { ModalProfile } from '../modal-profile';
import { ThemeSwitcher } from '../theme-switcher';
import Notification from '../notification';

type MenuItem = Required<MenuProps>['items'][number];

const { Header } = Layout;

export const MainHeader = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onLogout = async () => {
    await dispatch(logout());
    navigate(ROUTES.index);
  };

  const items: MenuItem[] = [
    {
      key: 'profile',
      icon: <AuditOutlined />,
      label: 'Профиль',
      onClick: async () => {
        await dispatch(profile());
        setIsModalOpen(true);
      },
    },
    {
      key: 'exit',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: onLogout,
    },
  ];

  return (
    <Header className="border-b-1 border-[#0505050f]">
      <Flex justify="space-between" align="center" className="!px-4">
        <BreadCrumbNav />

        <Flex align="center" gap={16}>
          <ThemeSwitcher />
          <Flex align="center" gap={8}>
            <Notification />

            {user ? (
              <Flex align="center" gap={8} className="cursor-pointer">
                <Avatar src={user.image || undefined} alt="avatar" icon={<UserOutlined />} />
                <Dropdown menu={{ items }} trigger={['click']}>
                  <Space>
                    {user?.email}
                    <DownOutlined />
                  </Space>
                </Dropdown>
              </Flex>
            ) : (
              <Link to={ROUTES.login}>Войти</Link>
            )}
          </Flex>
        </Flex>

        <ModalProfile isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} onLogout={onLogout} />
      </Flex>
    </Header>
  );
};
