import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ProjectForm, type FieldType } from '.';
import { useThemeToken } from '@src/hooks/use-theme-token';

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('@src/hooks/use-theme-token');

describe('ProjectForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  let user: ReturnType<typeof userEvent.setup>;

  const mockInitialValues: FieldType = {
    name: 'Тестовый проект',
    description: 'Описание тестового проекта',
    color: '#FF5733',
    isFavorite: true,
  };

  const defaultToken = {
    colorProject: '#ff00ff',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    (useThemeToken as jest.Mock).mockReturnValue({ token: defaultToken });
  });

  describe('Рендер компонента', () => {
    test('Рендер формы', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/описание/i)).toBeInTheDocument();
      expect(screen.getByTestId(/color/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/добавить в избранное/i)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /отмена/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /добавить/i })).toBeInTheDocument();

      expect(screen.getByPlaceholderText('Введите имя')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Введите описание')).toBeInTheDocument();
    });

    test('Рендер с init', () => {
      render(<ProjectForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement;
      const descriptionTextarea = screen.getByLabelText(/описание/i) as HTMLTextAreaElement;
      const favoriteSwitch = screen.getByLabelText(/добавить в избранное/i);

      expect(nameInput.value).toBe(mockInitialValues.name);
      expect(descriptionTextarea.value).toBe(mockInitialValues.description);
      expect(favoriteSwitch).toBeChecked();
    });

    test('Цвет из токена', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(useThemeToken).toHaveBeenCalled();
    });

    test('Рендер Alert при isLock = true', () => {
      render(<ProjectForm isLock={true} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/редактируется в другой вкладке/i);
    });

    test('Рендер Alert при isLock = false', () => {
      render(<ProjectForm isLock={false} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Валидация формы', () => {
    test('Не заполнено обязательное поле', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const button = screen.getByRole('button', { name: /добавить/i });
      await user.click(button);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('Заполнено обязательное поле', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.type(screen.getByLabelText(/имя/i), 'Только имя');

      const button = screen.getByRole('button', { name: /добавить/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'Только имя',
          description: undefined,
          color: defaultToken.colorProject,
          isFavorite: undefined,
        });
      });
    });

    test('Ограничение длины имени', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/имя/i);
      await user.type(nameInput, 'A'.repeat(130));

      expect((nameInput as HTMLInputElement).value.length).toBeLessThanOrEqual(120);
    });

    test('Ограничение длины описания', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const descriptionInput = screen.getByLabelText(/описание/i);
      await user.type(descriptionInput, 'A'.repeat(250));

      expect((descriptionInput as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(200);
    });
  });

  describe('Отправка формы', () => {
    test('Все заполненные поля', async () => {
      const formData = { name: 'Новый проект', description: 'Описание проекта', isFavorite: true };

      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await user.type(screen.getByLabelText(/имя/i), formData.name);
      await user.type(screen.getByLabelText(/описание/i), formData.description);
      await user.click(screen.getByLabelText(/добавить в избранное/i));

      const button = screen.getByRole('button', { name: /добавить/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining(formData));
      });
    });

    test('Отправка init', async () => {
      render(<ProjectForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const button = screen.getByRole('button', { name: /добавить/i });
      await user.click(button);
      await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith(mockInitialValues));
    });
  });

  describe('Взаимодействие с формой', () => {
    test('switch', async () => {
      render(<ProjectForm initialValues={{ isFavorite: false }} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const favorite = screen.getByLabelText(/добавить в избранное/i);
      expect(favorite).not.toBeChecked();

      await user.click(favorite);
      expect(favorite).toBeChecked();

      await user.click(favorite);
      expect(favorite).not.toBeChecked();
    });

    test('onCancel при клике на кнопку отмены', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const button = screen.getByRole('button', { name: /отмена/i });
      await user.click(button);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Обновление init', () => {
    test('Обновление формы при изменении init', async () => {
      const { rerender } = render(
        <ProjectForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      );

      const newValues = {
        name: 'Новый проект',
        description: 'Новое описание',
        color: '#00FF00',
        isFavorite: false,
      };

      rerender(<ProjectForm initialValues={newValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement;
        const descriptionInput = screen.getByLabelText(/описание/i) as HTMLTextAreaElement;
        const favoriteSwitch = screen.getByLabelText(/добавить в избранное/i);

        expect(nameInput.value).toBe(newValues.name);
        expect(descriptionInput.value).toBe(newValues.description);
        expect(favoriteSwitch).not.toBeChecked();
      });
    });

    test('Отсутствии цвета в init', async () => {
      const init = { name: 'Проект', description: 'Описание' };

      render(<ProjectForm initialValues={init} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(useThemeToken).toHaveBeenCalled();
    });
  });
});
