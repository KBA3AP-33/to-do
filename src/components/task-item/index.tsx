import { EllipsisOutlined, ExportOutlined } from '@ant-design/icons';
import { type Task } from '@src/types';
import { Button, Dropdown, List, type MenuProps, Typography } from 'antd';
import { type FC } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
  task: Task;
  onShow: (id: string) => void;
}

const { Text } = Typography;

export const TaskItem: FC<Props> = ({ task, onShow }) => {
  const menuItems: MenuItem[] = [{ key: 'show', icon: <ExportOutlined />, label: 'Показать в проекте' }];

  return (
    <List.Item
      actions={[
        <Dropdown
          menu={{
            items: menuItems,
            onClick: e => {
              switch (e.key) {
                case 'show':
                  return onShow(task.projectId ?? '');
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
        <div className="flex flex-col justify-start">
          <Text className="font-bold">{task.name}</Text>
          <Text type="secondary">{task.description}</Text>
        </div>
      </div>
    </List.Item>
  );
};
