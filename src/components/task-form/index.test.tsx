import { render, screen, waitFor } from '@testing-library/react';
import { TaskForm } from '.';
import userEvent from '@testing-library/user-event';

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const mockSubmit = jest.fn();

describe('render', () => {
  test('Рендер формы', () => {
    render(<TaskForm />);

    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
    expect(screen.getByLabelText('Приоритет')).toBeInTheDocument();
    expect(screen.getByLabelText('Срок')).toBeInTheDocument();

    expect(screen.getByText('Отмена')).toBeInTheDocument();
    expect(screen.getByText('Добавить')).toBeInTheDocument();
  });

  test('Рендер формы c init', () => {
    const date = '2025-12-12 00:28:29';
    render(<TaskForm initialValues={{ name: 'test', description: 'test1', date }} />);

    expect(screen.getByLabelText('Имя')).toHaveValue('test');
    expect(screen.getByLabelText('Описание')).toHaveValue('test1');
    expect(screen.getByLabelText('Срок')).toHaveValue(date);
  });
});

describe('Заполнение формы', () => {
  test('Отправка', async () => {
    const user = userEvent.setup();

    render(<TaskForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText('Имя'), 'test');
    await user.type(screen.getByLabelText('Описание'), 'test1');
    await user.click(screen.getByText('Добавить'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'test',
        description: 'test1',
        date: null,
        priority: undefined,
      });
    });
  });
});
