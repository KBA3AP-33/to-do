import { CheckSquareOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, StarOutlined } from '@ant-design/icons';
import { ROUTES } from '@src/routes';
import { type Project } from '@src/types';
import { Button, Dropdown, List, type MenuProps, Typography } from 'antd';
import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectStatus } from '../project-status';
import { ProjectStatus as ProjectStatusType } from '@src/config/statuses/project';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
  project: Project;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFavorite?: (id: string) => void;
  onCompleted?: (id: string) => void;
  hideControls?: boolean;
}

const { Text } = Typography;

export const ProjectItem: FC<Props> = ({ project, onEdit, onDelete, onFavorite, onCompleted, hideControls }) => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      key: 'favourite',
      icon: <StarOutlined />,
      label: project.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное',
    },
    { key: 'completed', icon: <CheckSquareOutlined />, label: 'Завершить все задачи' },
    { key: 'update', icon: <EditOutlined />, label: 'Изменить' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Удалить',
      danger: true,
    },
  ].filter(x => (x.key === 'completed' && !project.isCompleted && project.tasks.length) || x.key !== 'completed');

  const onClickMenu: MenuProps['onClick'] = e => {
    switch (e.key) {
      case 'favourite':
        return onFavorite?.(project.id);
      case 'completed':
        return onCompleted?.(project.id);
      case 'update':
        return onEdit?.(project.id);
      case 'delete':
        return onDelete?.(project.id);
      default:
        return;
    }
  };

  const actions = hideControls
    ? []
    : [
        <Dropdown menu={{ items: menuItems, onClick: onClickMenu }} trigger={['click']}>
          <Button type="default" icon={<EllipsisOutlined />} className="!text-base !rounded-full" />
        </Dropdown>,
      ];

  return (
    <List.Item actions={actions}>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-start gap-4">
          <div className="pt-1">
            <div className="w-[24px] h-[24px] rounded" style={{ backgroundColor: project.color }}></div>
          </div>
          <div className="flex flex-col justify-start">
            <Text
              className="font-bold hover:cursor-pointer hover:underline"
              onClick={() => navigate(ROUTES.projectsItem(project.id))}
            >
              {project.name}
            </Text>
            <Text type="secondary">{project.description}</Text>
          </div>
        </div>

        {project.isCompleted ? (
          <ProjectStatus status={ProjectStatusType.COMPLETED} />
        ) : !project.tasks.length ? (
          <ProjectStatus status={ProjectStatusType.EMPTY} />
        ) : (
          <ProjectStatus status={ProjectStatusType.WORK} />
        )}
      </div>
    </List.Item>
  );
};
