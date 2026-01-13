import { CheckOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button, Dropdown, List, Typography, type MenuProps } from 'antd';
import { getRemainingTime } from '@src/utils/get-remaining-time';
import { TaskStatus, type Task } from '@src/types';
import type { FC } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: 'duplicate', icon: <PlusSquareOutlined />, label: 'Дублировать' },
  { key: 'update', icon: <EditOutlined />, label: 'Изменить' },
  {
    key: 'delete',
    icon: <DeleteOutlined />,
    label: 'Удалить',
    danger: true,
  },
];

interface Props {
  task: Task;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: Task) => void;
  onUpdateStatus?: (value: { id: string; status: TaskStatus }) => void;
  currentColor: string;
}

const { Text } = Typography;

export const ProjectItemListItem: FC<Props> = ({
  task,
  onEdit,
  onDelete,
  currentColor,
  onUpdateStatus,
  onDuplicate,
}) => {
  const date = task.date && task.status !== TaskStatus.FULFILLED ? getRemainingTime(task.date) : '';

  const onClickMenu: MenuProps['onClick'] = e => {
    switch (e.key) {
      case 'duplicate':
        return onDuplicate?.(task);
      case 'update':
        return onEdit?.(task.id);
      case 'delete':
        return onDelete?.(task.id);
      default:
        return;
    }
  };

  const onUpdate = () => {
    onUpdateStatus?.({
      id: task.id,
      status: task.status === TaskStatus.FULFILLED ? TaskStatus.IN_WORK : TaskStatus.FULFILLED,
    });
  };

  return (
    <List.Item>
      <div className="w-full flex items-center gap-2">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div
              className="w-[18px] h-[18px] border-2 border-gray-300 rounded-full flex justify-center items-center cursor-pointer"
              style={{ borderColor: currentColor }}
              onClick={onUpdate}
            >
              {task.status === TaskStatus.FULFILLED && <CheckOutlined style={{ fontSize: 8, color: currentColor }} />}
            </div>
            <div className="flex flex-col justify-start">
              <p>{task.name}</p>
              <div className="flex gap-2">
                {task.description && <Text type="secondary">{task.description}</Text>}
                {!!date && <Text type={/\d/.test(date) ? 'secondary' : 'danger'}>({date})</Text>}
              </div>
            </div>
          </div>

          <Dropdown menu={{ items: menuItems, onClick: onClickMenu }} trigger={['click']}>
            <Button type="default" icon={<EllipsisOutlined />} style={{ fontSize: '16px', borderRadius: 1000 }} />
          </Dropdown>
        </div>
      </div>
    </List.Item>
  );
};
