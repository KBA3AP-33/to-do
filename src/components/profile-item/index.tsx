import type { FC } from 'react';
import { Flex, Typography } from 'antd';

interface Props {
  title: string;
  value: React.ReactNode;
}

const { Text } = Typography;

export const ProfileItem: FC<Props> = ({ title, value }) => {
  return (
    <Flex>
      <Text className="!text-[var(--color-custom-gray)] text-nowrap">{title}&nbsp;</Text>
      <Text className="font-semibold">{value}</Text>
    </Flex>
  );
};
