import { Button, ColorPicker, Flex, Form, Input, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { type FC, useEffect } from 'react';

export type FieldType = {
  name?: string;
  description?: string;
  color?: string;
  isFavourites?: boolean;
};

interface Props {
  isLoading?: boolean;
  initialValues?: FieldType;
  onSubmit?: (values: FieldType) => void;
  submitText?: string;
  onCancel?: () => void;
}

export const ProjectForm: FC<Props> = ({ isLoading, initialValues, onSubmit, submitText = 'Добавить', onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues ?? { color: '#ea4b3a' });
  }, [initialValues, form]);

  return (
    <Form form={form} onFinish={onSubmit} autoComplete="off" layout="vertical" requiredMark={false}>
      <Form.Item<FieldType> label="Имя" name="name" rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}>
        <Input showCount maxLength={120} placeholder="Введите имя" />
      </Form.Item>

      <Form.Item<FieldType> label="Описание" name="description">
        <TextArea showCount maxLength={200} placeholder="Введите описание" style={{ height: 120, resize: 'none' }} />
      </Form.Item>

      <Form.Item<FieldType> label="Цвет" name="color">
        <ColorPicker
          format="hex"
          onChange={v => form.setFieldValue('color', v.toHexString())}
          showText={color => <span>Выбранный цвет ({color.toHexString()})</span>}
          className="w-full"
          style={{ justifyContent: 'flex-start' }}
        />
      </Form.Item>

      <Form.Item<FieldType> label="Добавить в избранное" name="isFavourites" layout="horizontal">
        <Switch />
      </Form.Item>

      <Flex justify="flex-end" gap={8}>
        <Form.Item noStyle>
          <Button onClick={onCancel}>Отмена</Button>
        </Form.Item>

        <Form.Item noStyle>
          <Button loading={isLoading} type="primary" htmlType="submit" variant="solid" color="primary">
            {submitText}
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
};
