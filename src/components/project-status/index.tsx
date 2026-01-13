import type { FC } from 'react';
import { Tag, type TagProps } from 'antd';
import { ProjectStatus as ProjectStatusType, statuses } from '@src/config/statuses/project';

interface Props extends Omit<TagProps, 'color' | 'variant'> {
  status: ProjectStatusType;
}

export const ProjectStatus: FC<Props> = ({ status, ...props }) => {
  const { title, color } = statuses[status];

  return (
    <Tag color={color} variant="filled" {...props}>
      {title}
    </Tag>
  );
};
