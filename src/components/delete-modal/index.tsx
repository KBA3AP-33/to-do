import { Modal, type ModalProps, Typography } from 'antd';
import type { FC } from 'react';

interface Props extends ModalProps {
  isLoading?: boolean;
  title: string;
  description: string;
}

const { Title, Text } = Typography;

export const DeleteModal: FC<Props> = ({ isLoading, title, description, ...props }) => {
  return (
    <Modal
      title={<Title level={5}>{title}</Title>}
      okText="Удалить"
      okButtonProps={{ variant: 'solid', color: 'primary', loading: isLoading }}
      cancelText={'Отмена'}
      {...props}
    >
      <Text>{description}</Text>
    </Modal>
  );
};
