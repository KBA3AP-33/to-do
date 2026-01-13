import { HomeOutlined, RollbackOutlined } from '@ant-design/icons';
import { AuthLayout } from '@src/layouts/auth';
import { Button, Flex, Typography } from 'antd';
import type { FC } from 'react';

interface Props {
  title?: string;
  subTitle?: string;
  homeButtonText?: string;
  homeButtonClick?: () => void;
  backButtonText?: string;
  backButtonClick?: () => void;
  backButtonIcon?: React.ReactNode;
}

const { Title, Text } = Typography;

export const Error: FC<Props> = ({
  title,
  subTitle,
  homeButtonText = 'На главную',
  homeButtonClick,
  backButtonText = 'Назад',
  backButtonClick,
  backButtonIcon,
}) => {
  return (
    <AuthLayout>
      <Flex vertical justify="center" align="center">
        <Flex vertical justify="center" align="center" gap={16} className="!mb-8">
          <Title className="!text-7xl !font-bold !tracking-tight">{title}</Title>
          <Text className="!text-3xl">{subTitle}</Text>
        </Flex>

        <Flex align="center" gap={16}>
          <Button
            variant="solid"
            color="primary"
            size="large"
            icon={<HomeOutlined />}
            iconPlacement="start"
            onClick={homeButtonClick}
          >
            {homeButtonText}
          </Button>
          <Button
            size="large"
            icon={backButtonIcon ?? <RollbackOutlined />}
            iconPlacement="start"
            onClick={backButtonClick}
          >
            {backButtonText}
          </Button>
        </Flex>
      </Flex>
    </AuthLayout>
  );
};
