import { useThemeToken } from '@src/hooks/use-theme-token';
import { Alert, Button, ColorPicker, Flex, Form, Input, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { type FC, useEffect } from 'react';

export type FieldType = {
  name?: string;
  description?: string;
  color?: string;
  isFavorite?: boolean;
};

interface Props {
  isLoading?: boolean;
  initialValues?: FieldType;
  onSubmit?: (values: FieldType) => void;
  submitText?: string;
  onCancel?: () => void;
  isLock?: boolean;
}

export const ProjectForm: FC<Props> = ({
  isLoading,
  initialValues,
  onSubmit,
  submitText = 'Добавить',
  onCancel,
  isLock = false,
}) => {
  const { token } = useThemeToken();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues ?? { color: token?.colorProject });
  }, [initialValues, form, token]);

  return (
    <Form form={form} onFinish={onSubmit} autoComplete="off" layout="vertical" requiredMark={false}>
      {isLock && (
        <Alert
          title="Этот проект сейчас редактируется в другой вкладке. Дождитесь завершения или перезагрузите страницу."
          type="error"
          showIcon
          className="!mt-4 !mb-4"
        />
      )}

      <Form.Item<FieldType> label="Имя" name="name" rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}>
        <Input showCount maxLength={120} placeholder="Введите имя" />
      </Form.Item>

      <Form.Item<FieldType> label="Описание" name="description">
        <TextArea
          showCount
          maxLength={200}
          placeholder="Введите описание"
          className="!h-[120px] [&>textarea]:!resize-none"
        />
      </Form.Item>

      <Form.Item<FieldType> label="Цвет" name="color">
        <ColorPicker
          data-testid="color"
          format="hex"
          onChange={v => form.setFieldValue('color', v.toHexString())}
          showText={color => <span>Выбранный цвет ({color.toHexString()})</span>}
          className="w-full !justify-start"
        />
      </Form.Item>

      <Form.Item<FieldType> label="Добавить в избранное" name="isFavorite" layout="horizontal">
        <Switch />
      </Form.Item>

      <Flex justify="flex-end" gap={8}>
        <Form.Item noStyle>
          <Button onClick={onCancel}>Отмена</Button>
        </Form.Item>

        <Form.Item noStyle>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            variant="solid"
            color="primary"
            disabled={isLock}
          >
            {submitText}
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};
