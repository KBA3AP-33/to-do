import { FlagOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import type { FC } from 'react';
import dayjs from 'dayjs';
import { priorities } from '@src/consts';

export type FieldType = {
  name?: string;
  description?: string;
  priority?: string;
  date?: string;
};

interface Props {
  isLoading?: boolean;
  initialValues?: FieldType;
  onSubmit?: (values: FieldType) => void;
  submitText?: string;
  onCancel?: () => void;
}

export const TaskForm: FC<Props> = ({ isLoading, initialValues, submitText = 'Добавить', onSubmit, onCancel }) => {
  return (
    <Form
      initialValues={{
        ...initialValues,
        date: initialValues?.date ? dayjs(initialValues.date) : null,
      }}
      onFinish={onSubmit}
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item<FieldType> label="Имя" name="name" rules={[{ required: true, message: 'Пожалуйста введите имя!' }]}>
        <Input showCount maxLength={120} placeholder="Введите имя" />
      </Form.Item>

      <Form.Item<FieldType> label="Описание" name="description">
        <TextArea showCount maxLength={200} placeholder="Введите описание" style={{ height: 120, resize: 'none' }} />
      </Form.Item>

      <Flex gap={8}>
        <Form.Item<FieldType> label="Приоритет" name="priority" className="flex-1">
          <Select
            placeholder="Приоритет"
            options={priorities.map(x => ({
              value: x.value,
              label: <p className={`text-${x.color}-600`}>Приоритет {+x.value + 1}</p>,
            }))}
            optionRender={option => {
              const color = priorities.find(x => x.value === option.value)?.color;

              return (
                <Flex gap={8}>
                  <FlagOutlined style={{ color: `var(--color-${color}-600)` }} />
                  <p>{option.label}</p>
                </Flex>
              );
            }}
          />
        </Form.Item>

        <Form.Item<FieldType> label="Срок" name="date" className="flex-1">
          <DatePicker placeholder="Выберите дату" className="w-full" showTime />
        </Form.Item>
      </Flex>

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
