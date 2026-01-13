import { useEffect, useState, type FC } from 'react';
import { Form, Input, Flex, Typography, Button } from 'antd';
import { UploadImage } from '@src/containers/upload-image';
import type { User } from '@src/types';
import { MaskedInput } from 'antd-mask-input';
import { cleanPhoneNumber } from '@src/utils/clean-phone-number';
import { useThemeToken } from '@src/hooks/use-theme-token';
import { useTheme } from '@src/hooks/use-theme';

interface Props {
  initialValues: User;
  onCancel?: () => void;
  onSubmit?: (values: Pick<User, 'username' | 'lastname' | 'phone' | 'image'>, isClose?: boolean) => Promise<void>;
  isLoading?: boolean;
}

const { Text } = Typography;

export const ProfileForm: FC<Props> = ({ initialValues, onCancel, onSubmit, isLoading }) => {
  const { token } = useThemeToken();
  const { theme } = useTheme();

  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(initialValues.image);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  return (
    <Flex gap={16}>
      <Flex gap={8} vertical>
        <Text className="font-bold">Фото</Text>
        <UploadImage
          initImageUrl={initialValues.image}
          onChange={async url => {
            await onSubmit?.({ image: url }, false);
            setImageUrl(url);
          }}
        />
      </Flex>

      <Form
        form={form}
        onFinish={values => onSubmit?.({ ...values, phone: cleanPhoneNumber(values.phone) ?? '', image: imageUrl })}
        className="flex-1"
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item<User> label="Имя" name="username">
          <Input showCount maxLength={20} placeholder="Введите имя" />
        </Form.Item>

        <Form.Item<User> label="Фамилия" name="lastname">
          <Input showCount maxLength={30} placeholder="Введите фамилию" />
        </Form.Item>

        <Form.Item<User> label="Телефон" name="phone">
          <MaskedInput
            mask="+7 (000) 000-00-00"
            className={`${theme === 'light' ? '!placeholder-black' : '!placeholder-white'} !bg-transparent`}
            style={{ color: token?.colorCustomBlack }}
          />
        </Form.Item>

        <Flex justify="flex-end" gap={8}>
          <Form.Item noStyle>
            <Button onClick={onCancel}>Отмена</Button>
          </Form.Item>

          <Form.Item noStyle>
            <Button loading={isLoading} type="primary" htmlType="submit" variant="solid" color="primary">
              Сохранить
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
};
