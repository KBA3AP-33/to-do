import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ProfileForm } from '.';
import { UploadImage } from '@src/containers/upload-image';
import { cleanPhoneNumber } from '@src/utils/clean-phone-number';
import { useThemeToken } from '@src/hooks/use-theme-token';
import { useTheme } from '@src/hooks/use-theme';
import type { User } from '@src/types';

jest.mock('@src/containers/upload-image');
jest.mock('@src/utils/clean-phone-number');
jest.mock('@src/hooks/use-theme-token');
jest.mock('@src/hooks/use-theme');

const mockCleanPhoneNumber = jest.fn();

const mockInitialValues = {
  username: 'Иван',
  lastname: 'Иванов',
  phone: '+7 (123) 456-78-90',
  image: 'https://test/avatar.jpg',
} as User;

describe('ProfileForm', () => {
  const mockOnCancel = jest.fn();
  const mockOnSubmit = jest.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();

    (UploadImage as jest.Mock).mockImplementation(({ initImageUrl, onChange }) => (
      <div data-testid="upload">
        <button onClick={() => onChange?.('https://test/new-avatar.jpg')}>Upload</button>
        <div data-testid="url">{initImageUrl}</div>
      </div>
    ));

    (cleanPhoneNumber as jest.Mock).mockImplementation(mockCleanPhoneNumber);
    (useThemeToken as jest.Mock).mockReturnValue({ token: { colorCustomBlack: '#000000' } });
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light' });
  });

  describe('Рендер компонента', () => {
    test('Рендер с init', () => {
      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      expect(screen.getByText(/фото/i)).toBeInTheDocument();

      expect(screen.getByTestId('upload')).toBeInTheDocument();
      expect(screen.getByTestId('url')).toHaveTextContent(mockInitialValues.image!);

      const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement;
      const lastnameInput = screen.getByLabelText(/фамилия/i) as HTMLInputElement;
      const phoneInput = screen.getByLabelText(/телефон/i) as HTMLInputElement;

      expect(nameInput).toBeInTheDocument();
      expect(lastnameInput).toBeInTheDocument();
      expect(phoneInput).toBeInTheDocument();

      expect(nameInput.value).toBe(mockInitialValues.username);
      expect(lastnameInput.value).toBe(mockInitialValues.lastname);
      expect(phoneInput.value).toBe(mockInitialValues.phone);

      expect(screen.getByRole('button', { name: /отмена/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument();
    });

    test('Рендер атрибутов', () => {
      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/имя/i);
      const lastnameInput = screen.getByLabelText(/фамилия/i);

      expect(nameInput).toHaveAttribute('maxLength', '20');
      expect(lastnameInput).toHaveAttribute('maxLength', '30');

      expect(screen.getByPlaceholderText('Введите имя')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Введите фамилию')).toBeInTheDocument();
    });
  });

  describe('Изменения формы', () => {
    test('Изменении init', () => {
      const { rerender } = render(
        <ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />
      );

      const newValues = { ...mockInitialValues, username: 'Петр' };

      rerender(<ProfileForm initialValues={newValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement;
      const lastnameInput = screen.getByLabelText(/фамилия/i) as HTMLInputElement;

      expect(nameInput.value).toBe(newValues.username);
      expect(lastnameInput.value).toBe(mockInitialValues.lastname);
    });

    test('Изображение', async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /upload/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ image: 'https://test/new-avatar.jpg' }, false);
      });
    });
  });

  describe('Отправка формы', () => {
    test('Валидные данные', async () => {
      const phohe = '+71234567890';
      mockCleanPhoneNumber.mockReturnValue(phohe);
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/имя/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Алексей');

      const lastnameInput = screen.getByLabelText(/фамилия/i);
      await user.clear(lastnameInput);
      await user.type(lastnameInput, 'Сидоров');

      const phoneInput = screen.getByLabelText(/телефон/i);
      await user.clear(phoneInput);
      await user.type(phoneInput, '8885554433');

      const submitButton = screen.getByRole('button', { name: /сохранить/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCleanPhoneNumber).toHaveBeenCalledWith('+7 (888) 555-44-33');
        expect(mockOnSubmit).toHaveBeenCalledWith({
          username: 'Алексей',
          lastname: 'Сидоров',
          phone: phohe,
          image: mockInitialValues.image,
        });
      });
    });

    test('Пустой телефон', async () => {
      mockCleanPhoneNumber.mockReturnValue('');
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const phoneInput = screen.getByLabelText(/телефон/i);
      await user.clear(phoneInput);

      const button = screen.getByRole('button', { name: /сохранить/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({ phone: '' }));
      });
    });

    test('Сохранение изображения', async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);
      mockOnSubmit.mockResolvedValueOnce(undefined);

      const { rerender } = render(
        <ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />
      );

      const button = screen.getByRole('button', { name: /upload/i });
      await user.click(button);

      const image = 'https://test/new-avatar.jpg';

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ image }, false);
      });

      rerender(
        <ProfileForm initialValues={{ ...mockInitialValues, image }} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />
      );

      const submit = screen.getByRole('button', { name: /сохранить/i });
      await user.click(submit);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({ image }));
      });
    });
  });

  describe('Кнопки действий', () => {
    test('Cancel', async () => {
      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /отмена/i });
      await user.click(button);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('Разблокирует кнопки после загрузки', async () => {
      const { rerender } = render(
        <ProfileForm
          initialValues={mockInitialValues}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
          isLoading={true}
        />
      );

      rerender(
        <ProfileForm
          initialValues={mockInitialValues}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /отмена/i });
      const submitButton = screen.getByRole('button', { name: /сохранить/i });

      expect(cancelButton).not.toBeDisabled();
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Валидация', () => {
    test('Ограничение длины имени', async () => {
      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/имя/i);
      const lastnameInput = screen.getByLabelText(/фамилия/i);

      const name = 'Очень очень длинное имя пользователя';
      await user.clear(nameInput);
      await user.type(nameInput, name);

      const lastname = 'Очень очень длинная фамилия пользователя для теста';
      await user.clear(lastnameInput);
      await user.type(lastnameInput, lastname);

      expect((nameInput as HTMLInputElement).value.length).toBeLessThanOrEqual(20);
      expect((lastnameInput as HTMLInputElement).value.length).toBeLessThanOrEqual(30);
    });
  });
});
