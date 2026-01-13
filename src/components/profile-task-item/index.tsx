import type { FC } from 'react';
import { Flex, Typography } from 'antd';
import { useThemeToken } from '@src/hooks/use-theme-token';

interface Props {
  count: number;
  title: string;
}

const { Text } = Typography;

export const ProfileTaskItem: FC<Props> = ({ count, title }) => {
  const { token } = useThemeToken();

  return (
    <Flex className="flex-1" align="center" gap={8} vertical>
      <Text className="!text-2xl" style={{ color: token?.colorCustomPrimary }} strong>
        {count}
      </Text>
      <Text className="!text-[var(--color-custom-gray)] text-nowrap">{title}</Text>
    </Flex>
  );
};
