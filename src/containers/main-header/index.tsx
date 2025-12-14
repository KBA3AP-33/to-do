import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Layout, type MenuProps, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@src/store';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@src/routes';
import { BreadCrumbNav } from '@src/components/bread-crumb-nav';
import { logout } from '@src/store/auth/slice';

type MenuItem = Required<MenuProps>['items'][number];

const { Header } = Layout;

export const MainHeader = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      key: 'exit',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      onClick: async () => {
        await dispatch(logout());
        navigate(ROUTES.index);
      },
    },
  ];

  return (
    <Header className="border-b-1 border-[#0505050f]">
      <div className="flex justify-between items-center px-4">
        <BreadCrumbNav />

        {user ? (
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar icon={<UserOutlined />} />
            <Dropdown menu={{ items }} trigger={['click']}>
              <Space>
                {user?.email}
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
        ) : (
          <Link to={ROUTES.login}>Войти</Link>
        )}
      </div>
    </Header>
  );
};
