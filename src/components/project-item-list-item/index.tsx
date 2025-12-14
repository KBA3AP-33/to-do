import { CheckOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, List, type MenuProps } from 'antd';
import { TaskStatus, type Task } from '@src/types';
import type { FC } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: 'update', icon: <EditOutlined />, label: 'Изменить' },
  {
    key: 'dalete',
    icon: <DeleteOutlined />,
    label: 'Удалить',
    danger: true,
  },
];

interface Props {
  task: Task;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (value: { id: string; status: TaskStatus }) => void;
  currentColor: string;
}

export const ProjectItemListItem: FC<Props> = ({ task, onEdit, onDelete, currentColor, onUpdateStatus }) => {
  return (
    <List.Item>
      <div className="w-full flex items-center gap-2">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-2">
            <div
              className="w-[18px] h-[18px] border-2 border-gray-300 rounded-full flex justify-center items-center cursor-pointer"
              style={{ borderColor: currentColor }}
              onClick={() =>
                onUpdateStatus({
                  id: task.id,
                  status: task.status === TaskStatus.FULFILLED ? TaskStatus.IN_WORK : TaskStatus.FULFILLED,
                })
              }
            >
              {task.status === TaskStatus.FULFILLED && <CheckOutlined style={{ fontSize: 8, color: currentColor }} />}
            </div>
            <p>{task.name}</p>
          </div>

          <Dropdown
            menu={{
              items: menuItems,
              onClick: e => (e.key === 'update' ? onEdit(task.id) : onDelete(task.id)),
            }}
            trigger={['click']}
          >
            <Button
              type="default"
              icon={<EllipsisOutlined />}
              style={{
                fontSize: '16px',
                borderRadius: 1000,
              }}
            />
          </Dropdown>
        </div>
      </div>
    </List.Item>
  );
};
