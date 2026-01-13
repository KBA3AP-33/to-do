import { Image } from 'antd';
import type { FC } from 'react';
import { Button, Flex } from 'antd';
import type { User } from '@src/types';
import { ProfileItem } from '@src/components/profile-item';
import { ProfileTaskItem } from '@src/components/profile-task-item';
import { phoneNumberFormat } from '@src/utils/phone-number-format';
import { FileImageOutlined } from '@ant-design/icons';
import { formatDate } from '@src/utils/format-date';
import dayjs from 'dayjs';

interface Props {
  user: User;
  onEdit?: () => void;
  onLogout?: () => Promise<void>;
}

export const Profile: FC<Props> = ({ user, onEdit, onLogout }) => {
  const { email, username, lastname, phone, reg, lastActive, image, statistic } = user;
  const { inWork = 0, fulfilled = 0 } = statistic ?? {};

  return (
    <Flex gap={24} vertical>
      <Flex gap={16}>
        {image ? (
          <Image width={175} alt="basic" src={image} />
        ) : (
          <Flex
            justify="center"
            align="center"
            className="w-[175px] h-[175px] border border-[var(--color-custom-gray)]"
          >
            <FileImageOutlined className="text-2xl !text-[var(--color-custom-gray)]" />
          </Flex>
        )}

        <Flex gap={8} vertical>
          <ProfileItem title="Email:" value={email} />
          <ProfileItem title="Имя:" value={username ?? '-'} />
          <ProfileItem title="Фамилия:" value={lastname ?? '-'} />
          <ProfileItem title="Телефон:" value={phone ? phoneNumberFormat('+0 (000) 000-00-00', phone) : '-'} />
          <ProfileItem title="Дата регистрации:" value={dayjs(reg).format('DD.MM.YYYY') ?? '-'} />
          <ProfileItem title="Последняя активность:" value={lastActive ? formatDate(lastActive) : '-'} />
        </Flex>
      </Flex>

      <Flex justify="center">
        <Flex className="max-w-[80%]" gap={64}>
          <ProfileTaskItem count={inWork + fulfilled} title="Всего задач" />
          <ProfileTaskItem count={fulfilled} title="Выполнено" />
          <ProfileTaskItem count={inWork} title="В процессе" />
        </Flex>
      </Flex>

      <Flex justify="flex-end" align="center" gap={8}>
        <Button className="!px-8" onClick={onEdit}>
          Редактировать
        </Button>
        <Button className="!px-8" variant="solid" color="primary" onClick={onLogout}>
          Выйти
        </Button>
      </Flex>
    </Flex>
  );
};
