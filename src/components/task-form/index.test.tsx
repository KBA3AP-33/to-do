import dayjs from 'dayjs';
import '@testing-library/jest-dom';
import { TaskForm, type FieldType } from '.';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestHelper } from '@src/__tests__/utils';

jest.mock('@src/consts', () => ({
  priorities: [
    { value: '0', color: 'red' },
    { value: '1', color: 'orange' },
    { value: '2', color: 'yellow' },
    { value: '3', color: 'blue' },
    { value: '4', color: 'green' },
  ],
}));

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const mockInitialValues: FieldType = {
    name: 'Тестовая задача',
    description: 'Описание тестовой задачи',
    priority: '2',
    date: dayjs().year(2025).month(0).date(5).hour(12).toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Рендер', () => {
    test('Должна отрендериться форма', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/описание/i)).toBeInTheDocument();
      expect(screen.getByTestId(/priority/i)).toBeInTheDocument();
      expect(screen.getByText(/срок/i)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /отмена/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /добавить/i })).toBeInTheDocument();
    });

    test('Должна отрендериться форма c начальным состоянием', () => {
      render(<TaskForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement;
      const descriptionTextarea = screen.getByLabelText(/описание/i) as HTMLTextAreaElement;

      expect(nameInput.value).toBe(mockInitialValues.name);
      expect(descriptionTextarea.value).toBe(mockInitialValues.description);
      expect(screen.getByText(/приоритет 3/i)).toBeInTheDocument();
    });

    test('date: null', () => {
      const values = { ...mockInitialValues, date: null } as unknown as FieldType;

      render(<TaskForm initialValues={values} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByPlaceholderText('Выберите дату')).toBeInTheDocument();
    });
  });

  describe('Валидация формы', () => {
    test('Форма не должна отправляться - не заполнено обязательное поле', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const button = screen.getByRole('button', { name: /добавить/i });
      await userEvent.click(button);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('Форма должна отправляться - заполнено обязательное поле', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await TestHelper.fill.input(/имя/i, 'name');
      await TestHelper.form.submit(/добавить/i, mockOnSubmit, {
        name: 'name',
        description: undefined,
        priority: undefined,
        date: null,
      });
    });
  });

  describe('Отправка формы', () => {
    test('Форма должна отправляться - все поля заполненны', async () => {
      const formData = {
        name: 'Новая задача',
        description: 'Подробное описание задачи',
        priority: '1',
        date: dayjs().year(2025).month(0).date(5).hour(12).toISOString(),
      };

      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await TestHelper.fill.input(/имя/i, formData.name);
      await TestHelper.fill.input(/описание/i, formData.description);

      const prioritySelect = screen.getByTestId(/priority/i);
      await userEvent.click(prioritySelect);

      await waitFor(() => expect(screen.getByText('Приоритет 2')).toBeInTheDocument());

      const priorityOption = screen.getByText('Приоритет 2');
      await userEvent.click(priorityOption);

      const { date: _, ...other } = formData;
      await TestHelper.form.submit(/добавить/i, mockOnSubmit, expect.objectContaining(other));
    });

    test('Форма должна отправляться с init', async () => {
      render(<TaskForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const { date: _, ...other } = mockInitialValues;
      await TestHelper.form.submit(/добавить/i, mockOnSubmit, expect.objectContaining(other));
    });

    test('Должно сработать ограничение длины имени', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/имя/i);

      await userEvent.type(nameInput, 'A'.repeat(130));
      expect((nameInput as HTMLInputElement).value.length).toBeLessThanOrEqual(120);
    });

    test('Должно сработать ограничение длины описания', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const descriptionInput = screen.getByLabelText(/описание/i);

      await userEvent.type(descriptionInput, 'B'.repeat(250));
      expect((descriptionInput as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(200);
    });
  });

  describe('Приоритет', () => {
    test('Должен отрендериться список приоритетов', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await userEvent.click(screen.getByTestId(/priority/i));
      await waitFor(() => {
        expect(screen.getByText('Приоритет 1')).toBeInTheDocument();
        expect(screen.getByText('Приоритет 2')).toBeInTheDocument();
        expect(screen.getByText('Приоритет 3')).toBeInTheDocument();
        expect(screen.getByText('Приоритет 4')).toBeInTheDocument();
        expect(screen.getByText('Приоритет 5')).toBeInTheDocument();
      });
    });

    test('Должен выбраться приоритет по клику', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await userEvent.click(screen.getByTestId(/priority/i));
      await waitFor(() => expect(screen.getByText('Приоритет 3')).toBeInTheDocument());
      expect(screen.getByText('Приоритет 3')).toBeInTheDocument();
    });
  });
});
