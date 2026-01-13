import dayjs from 'dayjs';
import '@testing-library/jest-dom';
import { TaskForm, type FieldType } from '.';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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
  let user: ReturnType<typeof userEvent.setup>;

  const mockInitialValues: FieldType = {
    name: 'Тестовая задача',
    description: 'Описание тестовой задачи',
    priority: '2',
    date: dayjs().year(2025).month(0).date(5).hour(12).toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  describe('Рендер', () => {
    test('Рендер полей формы', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/описание/i)).toBeInTheDocument();
      expect(screen.getByTestId(/priority/i)).toBeInTheDocument();
      expect(screen.getByText(/срок/i)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /отмена/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /добавить/i })).toBeInTheDocument();

      expect(screen.getByPlaceholderText('Введите имя')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Введите описание')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Выберите дату')).toBeInTheDocument();
    });

    test('Рендер с init', () => {
      render(<TaskForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement;
      const descriptionTextarea = screen.getByLabelText(/описание/i) as HTMLTextAreaElement;

      expect(nameInput.value).toBe(mockInitialValues.name);
      expect(descriptionTextarea.value).toBe(mockInitialValues.description);
    });

    test('date: null', () => {
      const values = { ...mockInitialValues, date: null } as unknown as FieldType;

      render(<TaskForm initialValues={values} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByPlaceholderText('Выберите дату')).toBeInTheDocument();
    });
  });

  describe('Валидация формы', () => {
    test('Пустое обязательное поле', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const button = screen.getByRole('button', { name: /добавить/i });
      await user.click(button);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('Только обязательное поле', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.type(screen.getByLabelText(/имя/i), 'name');

      const button = screen.getByRole('button', { name: /добавить/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'name',
          description: undefined,
          priority: undefined,
          date: null,
        });
      });
    });
  });

  describe('Отправка формы', () => {
    test('Все заполненные поля', async () => {
      const formData = {
        name: 'Новая задача',
        description: 'Подробное описание задачи',
        priority: '1',
        date: dayjs().year(2025).month(0).date(5).hour(12).toISOString(),
      };

      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.type(screen.getByLabelText(/имя/i), formData.name);
      await user.type(screen.getByLabelText(/описание/i), formData.description);

      const prioritySelect = screen.getByTestId(/priority/i);
      await user.click(prioritySelect);

      await waitFor(() => expect(screen.getByText('Приоритет 2')).toBeInTheDocument());

      const priorityOption = screen.getByText('Приоритет 2');
      await user.click(priorityOption);

      const datePicker = screen.getByPlaceholderText('Выберите дату');
      await user.click(datePicker);

      const submitButton = screen.getByRole('button', { name: /добавить/i });
      await user.click(submitButton);

      await waitFor(() => {
        const { date: _, ...other } = formData;
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining(other));
      });
    });

    test('Отправка с начальными значениями', async () => {
      render(<TaskForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const submitButton = screen.getByRole('button', { name: /добавить/i });
      await user.click(submitButton);

      await waitFor(() => {
        const { date: _, ...other } = mockInitialValues;
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining(other));
      });
    });

    test('Ограничение длины имени', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/имя/i);

      await user.type(nameInput, 'A'.repeat(130));
      expect((nameInput as HTMLInputElement).value.length).toBeLessThanOrEqual(120);
    });

    test('Ограничение длины описания', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const descriptionInput = screen.getByLabelText(/описание/i);

      await user.type(descriptionInput, 'B'.repeat(250));
      expect((descriptionInput as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(200);
    });
  });

  describe('Приоритет', () => {
    test('Рендер', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.click(screen.getByTestId(/priority/i));
      await waitFor(() => {
        expect(screen.getByText('Приоритет 1')).toBeInTheDocument();
        expect(screen.getByText('Приоритет 2')).toBeInTheDocument();
        expect(screen.getByText('Приоритет 3')).toBeInTheDocument();
        expect(screen.getByText('Приоритет 4')).toBeInTheDocument();
        expect(screen.getByText('Приоритет 5')).toBeInTheDocument();
      });
    });

    test('Выбрать приоритета', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.click(screen.getByTestId(/priority/i));
      await waitFor(() => expect(screen.getByText('Приоритет 3')).toBeInTheDocument());
      expect(screen.getByText('Приоритет 3')).toBeInTheDocument();
    });
  });
});
