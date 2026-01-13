import type { FC } from 'react';
import { Divider, Typography } from 'antd';

const { Title } = Typography;

interface Props {
  title: string;
}

export const ModalTitle: FC<Props> = ({ title }) => {
  return (
    <>
      <Title level={4}>{title}</Title>
      <Divider size="small" />
    </>
  );
};
