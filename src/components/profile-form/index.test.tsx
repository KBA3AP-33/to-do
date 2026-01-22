import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ProfileForm } from '.';
import { UploadImage } from '@src/containers/upload-image';
import { cleanPhoneNumber } from '@src/utils/clean-phone-number';
import { useThemeToken } from '@src/hooks/use-theme-token';
import { useTheme } from '@src/hooks/use-theme';
import type { User } from '@src/types';
import { TestHelper } from '@src/__tests__/utils';

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

  beforeEach(() => {
    jest.clearAllMocks();

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
    test('Должна отрендериться форма', () => {
      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      expect(screen.getByText(/фото/i)).toBeInTheDocument();

      expect(screen.getByTestId('upload')).toBeInTheDocument();
      expect(screen.getByTestId('url')).toHaveTextContent(mockInitialValues.image!);

      expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/фамилия/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/телефон/i)).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /отмена/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /сохранить/i })).toBeInTheDocument();
    });

    test('Должна отрендериться форма c начальным состоянием', () => {
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

    test('Должна отрендериться атрибуты у инпутов', () => {
      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/имя/i);
      const lastnameInput = screen.getByLabelText(/фамилия/i);

      expect(nameInput).toHaveAttribute('maxLength', '20');
      expect(lastnameInput).toHaveAttribute('maxLength', '30');
    });
  });

  describe('Изменения формы', () => {
    test('Форма должна перерендериться при изменении начального состояния', () => {
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

    test('Форма должна перерендериться при изменении изображения', async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /upload/i });
      await userEvent.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({ image: 'https://test/new-avatar.jpg' }, false);
      });
    });
  });

  describe('Отправка формы', () => {
    test('Форма должна отправляться', async () => {
      mockCleanPhoneNumber.mockReturnValue('+71234567890');
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      await TestHelper.fill.input(/имя/i, 'Алексей');
      await TestHelper.fill.input(/фамилия/i, 'Сидоров');
      await TestHelper.fill.phone(/телефон/i, '8885554433');
      await TestHelper.form.submit(
        /сохранить/i,
        mockOnSubmit,
        expect.objectContaining({ username: 'Алексей', lastname: 'Сидоров', image: mockInitialValues.image })
      );
      expect(mockCleanPhoneNumber).toHaveBeenCalledWith('+7 (888) 555-44-33');
    });

    test('Форма должна отправляться с пустым телефоном', async () => {
      mockCleanPhoneNumber.mockReturnValue('');
      mockOnSubmit.mockResolvedValueOnce(undefined);

      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      await userEvent.clear(screen.getByLabelText(/телефон/i));
      await userEvent.click(screen.getByRole('button', { name: /сохранить/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({ phone: '' }));
      });
    });

    test('Должно сохраняться изображение', async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined);
      mockOnSubmit.mockResolvedValueOnce(undefined);

      const { rerender } = render(
        <ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />
      );

      const button = screen.getByRole('button', { name: /upload/i });
      await userEvent.click(button);

      const image = 'https://test/new-avatar.jpg';

      await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith({ image }, false));

      rerender(
        <ProfileForm initialValues={{ ...mockInitialValues, image }} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />
      );

      const submit = screen.getByRole('button', { name: /сохранить/i });
      await userEvent.click(submit);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({ image }));
      });
    });
  });

  describe('Кнопки действий', () => {
    test('Должна сработать отмена', async () => {
      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const button = screen.getByRole('button', { name: /отмена/i });
      await userEvent.click(button);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('Должны разблокироваться кнопки после загрузки', async () => {
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

      expect(screen.getByRole('button', { name: /отмена/i })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /сохранить/i })).not.toBeDisabled();
    });
  });

  describe('Валидация', () => {
    test('Должны сработать ограничения длины имени и фамилии', async () => {
      render(<ProfileForm initialValues={mockInitialValues} onCancel={mockOnCancel} onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/имя/i);
      const lastnameInput = screen.getByLabelText(/фамилия/i);

      const name = 'Очень очень длинное имя пользователя';
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, name);

      const lastname = 'Очень очень длинная фамилия пользователя для теста';
      await userEvent.clear(lastnameInput);
      await userEvent.type(lastnameInput, lastname);

      expect((nameInput as HTMLInputElement).value.length).toBeLessThanOrEqual(20);
      expect((lastnameInput as HTMLInputElement).value.length).toBeLessThanOrEqual(30);
    });
  });
});
