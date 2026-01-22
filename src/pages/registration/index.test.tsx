import { render, screen, waitFor } from '@testing-library/react';
import { RegistrationPage } from '.';
import userEvent from '@testing-library/user-event';
import { TestHelper } from '@src/__tests__/utils';

jest.mock('react-redux', () => ({
  useSelector: () => ({ isLoadingApi: false }),
  useDispatch: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, ...props }: { children: React.ReactNode }) => <a {...props}>{children}</a>,
  useNavigate: () => jest.fn(),
}));

jest.mock('@src/config', () => ({ api: { baseUrl: 'test' } }));

const mockDispatch = jest.fn();
const mockRegisterApi = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@src/store/auth/slice', () => ({
  register: (values: unknown) => {
    mockRegisterApi(values);
    return async (_: unknown) => {
      return Promise.resolve();
    };
  },
}));

describe('RegistrationPage', () => {
  describe('Рендер', () => {
    test('Должна отрендериться форма', () => {
      render(<RegistrationPage />);

      expect(screen.getByText('Создать аккаунт')).toBeInTheDocument();

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
      expect(screen.getByLabelText('Повторите пароль')).toBeInTheDocument();

      expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
      expect(screen.getByText('Уже есть аккаунт?')).toBeInTheDocument();

      const loginLink = screen.getByText('Войти').closest('a');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('to', '/login');
    });
  });

  describe('Форма', () => {
    test('Ошибока валидации - форма не отправлена', async () => {
      const user = userEvent.setup();

      render(<RegistrationPage />);

      await TestHelper.fill.input('Email', 'invalid-email');
      await TestHelper.fill.input('Пароль', 'Password123');
      await TestHelper.fill.input('Повторите пароль', 'Password123');

      const button = screen.getByText('Зарегистрироваться');
      await userEvent.click(button);

      await waitFor(() => expect(mockDispatch).not.toHaveBeenCalled());
    });

    test('Форма должна быть отправлена', async () => {
      render(<RegistrationPage />);

      await TestHelper.fill.input('Email', 'test2@m.ru');
      await TestHelper.fill.input('Пароль', 'Password123');
      await TestHelper.fill.input('Повторите пароль', 'Password123');
      await TestHelper.form.submit(
        'Зарегистрироваться',
        mockRegisterApi,
        expect.objectContaining({
          email: 'test2@m.ru',
          password: 'Password123',
        })
      );
    });

    test('Дожен быть редирект после успешной регистрации', async () => {
      mockDispatch.mockImplementation(async action => {
        if (typeof action === 'function') {
          action(mockDispatch);
          return Promise.resolve().then(() => mockNavigate('/projects'));
        }
        return Promise.resolve();
      });
    });
  });
});
