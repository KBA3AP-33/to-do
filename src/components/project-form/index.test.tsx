import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ProjectForm, type FieldType } from '.';
import { useThemeToken } from '@src/hooks/use-theme-token';
import { TestHelper } from '@src/__tests__/utils';

jest.mock('@src/hooks/use-theme-token');

describe('ProjectForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

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
    (useThemeToken as jest.Mock).mockReturnValue({ token: defaultToken });
  });

  describe('Рендер компонента', () => {
    test('Должна отрендериться форма', () => {
      const { rerender } = render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/описание/i)).toBeInTheDocument();
      expect(screen.getByTestId(/color/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/добавить в избранное/i)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /отмена/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /добавить/i })).toBeInTheDocument();

      const alert =
        'Этот проект сейчас редактируется в другой вкладке. Дождитесь завершения или перезагрузите страницу.';

      expect(screen.queryByText(alert)).not.toBeInTheDocument();
      rerender(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLock />);
      expect(screen.getByText(alert)).toBeInTheDocument();
    });

    test('Должна отрендериться форма c начальным состоянием', () => {
      render(<ProjectForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement;
      const descriptionTextarea = screen.getByLabelText(/описание/i) as HTMLTextAreaElement;
      const favoriteSwitch = screen.getByLabelText(/добавить в избранное/i);

      expect(nameInput.value).toBe(mockInitialValues.name);
      expect(descriptionTextarea.value).toBe(mockInitialValues.description);
      expect(favoriteSwitch).toBeChecked();
      expect(screen.getByText(`Выбранный цвет (${mockInitialValues.color?.toLowerCase()})`)).toBeInTheDocument();
    });

    test('Должен использоваться цвет из токена', () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(useThemeToken).toHaveBeenCalled();
    });

    test('Должен рендериться Alert при isLock = true', () => {
      render(<ProjectForm isLock={true} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/редактируется в другой вкладке/i);
    });

    test('Не должен рендериться Alert при isLock = false', () => {
      render(<ProjectForm isLock={false} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Валидация формы', () => {
    test('Форма не должна отправляться - не заполнено обязательное поле', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const button = screen.getByRole('button', { name: /добавить/i });
      await userEvent.click(button);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('Форма должна отправляться - заполнено обязательное поле', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await TestHelper.fill.input(/имя/i, 'Имя');
      await TestHelper.form.submit(/добавить/i, mockOnSubmit, {
        name: 'Имя',
        description: undefined,
        color: defaultToken.colorProject,
        isFavorite: undefined,
      });
    });

    test('Должно сработать ограничение длины имени', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const nameInput = screen.getByLabelText(/имя/i);
      await userEvent.type(nameInput, 'A'.repeat(130));

      expect((nameInput as HTMLInputElement).value.length).toBeLessThanOrEqual(120);
    });

    test('Должно сработать ограничение длины описания', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const descriptionInput = screen.getByLabelText(/описание/i);
      await userEvent.type(descriptionInput, 'A'.repeat(250));

      expect((descriptionInput as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(200);
    });
  });

  describe('Отправка формы', () => {
    test('Форма должна отправляться - все поля заполненны', async () => {
      const formData = { name: 'Новый проект', description: 'Описание проекта', color: '#ff00ff', isFavorite: true };
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      await TestHelper.fill.input(/имя/i, formData.name);
      await TestHelper.fill.input(/описание/i, formData.description);
      await userEvent.click(screen.getByLabelText(/добавить в избранное/i));
      await TestHelper.form.submit(/добавить/i, mockOnSubmit, expect.objectContaining(formData));
    });

    test('Форма должна отправляться с init', async () => {
      render(<ProjectForm initialValues={mockInitialValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      await TestHelper.form.submit(/добавить/i, mockOnSubmit, expect.objectContaining(mockInitialValues));
    });
  });

  describe('Взаимодействие с формой', () => {
    test('Должен переключаться switch', async () => {
      render(<ProjectForm initialValues={{ isFavorite: false }} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const favorite = screen.getByLabelText(/добавить в избранное/i);
      expect(favorite).not.toBeChecked();

      await userEvent.click(favorite);
      expect(favorite).toBeChecked();

      await userEvent.click(favorite);
      expect(favorite).not.toBeChecked();
    });

    test('Должен сработать onCancel при клике на кнопку отмены', async () => {
      render(<ProjectForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const button = screen.getByRole('button', { name: /отмена/i });
      await userEvent.click(button);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('Обновление init', () => {
    test('Должна перерендериться форма при изменении init', async () => {
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
  });
});
