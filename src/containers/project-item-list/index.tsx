import { ConfigProvider, Empty, List } from 'antd';
import { TaskStatus, type Task } from '@src/types';
import { priorities } from '@src/consts';
import type { FC } from 'react';
import { ProjectItemListItem } from '@src/components/project-item-list-item';

interface Props {
  items?: Task[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (value: { id: string; status: TaskStatus }) => void;
}

export const ProjectItemList: FC<Props> = ({ items = [], onEdit, onDelete, onUpdateStatus }) => {
  return (
    <div className={`flex flex-col gap-4 flex-1 ${items?.length ? 'justify-start' : 'justify-center'}`}>
      <ConfigProvider renderEmpty={() => <Empty description={'Нет задач'} />}>
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
              />
            );
          }}
        />
      </ConfigProvider>
    </div>
  );
};
