import { HomeOutlined, RollbackOutlined } from '@ant-design/icons';
import { AuthLayout } from '@src/layouts/auth';
import { Button } from 'antd';
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
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <h1 className="text-7xl font-bold text-gray-800 tracking-tight">{title}</h1>
          <p className="text-3xl">{subTitle}</p>
        </div>

        <div className="flex gap-4 items-center">
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
        </div>
      </div>
    </AuthLayout>
  );
};
