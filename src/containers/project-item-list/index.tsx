import { ConfigProvider, Empty, Flex, List } from 'antd';
import { TaskStatus, type Task } from '@src/types';
import { priorities } from '@src/consts';
import type { FC } from 'react';
import { ProjectItemListItem } from '@src/components/project-item-list-item';

interface Props {
  items?: Task[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: Task) => void;
  onUpdateStatus?: (value: { id: string; status: TaskStatus }) => void;
}

export const ProjectItemList: FC<Props> = ({ items = [], onEdit, onDelete, onUpdateStatus, onDuplicate }) => {
  return (
    <Flex vertical gap={16} justify={items?.length ? 'flex-start' : 'center'} className="flex-1">
      <ConfigProvider renderEmpty={() => <Empty description="Нет задач" />}>
        <List
          dataSource={items}
          renderItem={item => {
            const color = priorities.find(x => x.value === `${item.priority}`)?.color;
            const currentColor = color ? `var(--color-${color}-600)` : `var(--color-gray-300)`;

            return (
              <ProjectItemListItem
                task={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
                currentColor={currentColor}
                onDuplicate={onDuplicate}
              />
            );
          }}
        />
      </ConfigProvider>
    </Flex>
  );
};
