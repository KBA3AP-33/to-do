import { DeleteOutlined, EditOutlined, EllipsisOutlined, StarOutlined } from '@ant-design/icons';
import { type Project } from '@src/types';
import { Button, Dropdown, List, type MenuProps, Typography } from 'antd';
import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
  project: Project;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onFavorite: (id: string) => void;
}

const { Text } = Typography;

export const ProjectItem: FC<Props> = ({ project, onEdit, onDelete, onFavorite }) => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      key: 'favourite',
      icon: <StarOutlined />,
      label: project.isFavourites ? 'Удалить из избранного' : 'Добавить в избранное',
    },
    { key: 'update', icon: <EditOutlined />, label: 'Изменить' },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Удалить',
      danger: true,
    },
  ];

  return (
    <List.Item
      actions={[
        <Dropdown
          menu={{
            items: menuItems,
            onClick: e => {
              switch (e.key) {
                case 'favourite':
                  return onFavorite(project.id);
                case 'update':
                  return onEdit(project.id);
                case 'delete':
                  return onDelete(project.id);
                default:
                  return;
              }
            },
          }}
          trigger={['click']}
        >
          <Button type="default" icon={<EllipsisOutlined />} style={{ fontSize: '16px', borderRadius: 1000 }} />
        </Dropdown>,
      ]}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <div className="w-[24px] h-[24px] rounded" style={{ backgroundColor: project.color }}></div>
        </div>
        <div className="flex flex-col justify-start">
          <Text className="font-bold hover:cursor-pointer hover:underline" onClick={() => navigate(`${project.id}`)}>
            {project.name}
          </Text>
          <Text type="secondary">{project.description}</Text>
        </div>
      </div>
    </List.Item>
  );
};
