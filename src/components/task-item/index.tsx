import { EllipsisOutlined, ExportOutlined } from '@ant-design/icons';
import { priorities } from '@src/consts';
import { type Task } from '@src/types';
import { Button, Dropdown, Flex, List, type MenuProps, Typography } from 'antd';
import { type FC } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
  task: Task;
  onShow: (id: string) => void;
  hidePriority?: boolean;
}

const { Text } = Typography;

export const TaskItem: FC<Props> = ({ task, onShow, hidePriority = true }) => {
  const menuItems: MenuItem[] = [{ key: 'show', icon: <ExportOutlined />, label: 'Показать в проекте' }];

  const priority = priorities.find(x => +x.value === +(task.priority ?? -1));

  const onClickMenu: MenuProps['onClick'] = e => {
    switch (e.key) {
      case 'show':
        return onShow(task.projectId ?? '');
      default:
        return;
    }
  };

  return (
    <List.Item
      actions={[
        <Dropdown menu={{ items: menuItems, onClick: onClickMenu }} trigger={['click']}>
          <Button type="default" icon={<EllipsisOutlined />} className="!text-base !rounded-full" />
        </Dropdown>,
      ]}
    >
      <Flex align="start" gap={8}>
        <Flex vertical justify="flex-start">
          <Flex gap={8}>
            <Text className="font-bold">{task.name}</Text>
            {!hidePriority && task.priority && (
              <Text className="font-bold" style={{ color: `var(--color-${priority?.color}-600)` }}>
                (Приоритет {task.priority})
              </Text>
            )}
          </Flex>
          <Text type="secondary">{task.description}</Text>
        </Flex>
      </Flex>
    </List.Item>
  );
};
