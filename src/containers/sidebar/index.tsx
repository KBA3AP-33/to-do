import {
  CheckCircleOutlined,
  DesktopOutlined,
  LaptopOutlined,
  ScheduleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Logo } from '@src/components/logo';
import { ROUTES } from '@src/routes';
import { useGetProjectsQuery } from '@src/store/projects/api';
import { TaskStatus } from '@src/types';
import { Flex, Layout, Menu, type MenuProps } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const { Sider } = Layout;

export const Sidebar = () => {
  const navigate = useNavigate();
  const { id, status } = useParams();

  const { data } = useGetProjectsQuery({ size: 999, isCompleted: false }, { refetchOnMountOrArgChange: true });
  const { data: projects = [] } = data ?? {};

  const favourites = projects.filter(x => x.isFavorite);

  const items: MenuItem[] = [
    { key: TaskStatus.IN_WORK, icon: <LaptopOutlined />, label: <span className="font-bold">В работе</span> },
    { key: TaskStatus.FULFILLED, icon: <CheckCircleOutlined />, label: <span className="font-bold">Выполнено</span> },
    {
      key: 'favourites',
      label: <span className="font-bold">Избранное</span>,
      icon: <StarOutlined />,
      children: favourites.map(x => ({ key: x.id + ':favourite', label: x.name })),
      className: favourites.length ? 'block' : 'hidden',
    },
    {
      key: 'projects',
      label: <span className="font-bold">Мои проекты</span>,
      icon: <DesktopOutlined />,
      children: projects.map(x => ({ key: x.id, label: x.name })),
    },
    {
      key: ROUTES.projectsCompleted,
      label: <span className="font-bold">Завершенные проекты</span>,
      icon: <ScheduleOutlined />,
    },
  ];

  const onClick: MenuProps['onClick'] = e => {
    const value = e.key.split(':')[0];
    switch (value) {
      case TaskStatus.IN_WORK:
        return navigate(ROUTES.statusProjects(TaskStatus.IN_WORK.toLowerCase()));
      case TaskStatus.FULFILLED:
        return navigate(ROUTES.statusProjects(TaskStatus.FULFILLED.toLowerCase()));
      case ROUTES.projectsCompleted:
        return navigate(`${ROUTES.projectsCompleted}`);
      default:
        return navigate(ROUTES.projectsItem(value));
    }
  };

  return (
    <Sider trigger={null} collapsible width={280} className="max-h-screen overflow-auto">
      <Link to={ROUTES.projects}>
        <Flex justify="center" className="w-full !mt-2 !mb-4">
          <Logo />
        </Flex>
      </Link>
      <Menu
        mode="inline"
        items={items}
        onClick={onClick}
        className="h-9/10 overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        selectedKeys={[...(id ? [id, id + ':favourite'] : []), ...(status ? [status.toUpperCase()] : [])]}
        defaultOpenKeys={['favourites', 'projects']}
      />
    </Sider>
  );
};
