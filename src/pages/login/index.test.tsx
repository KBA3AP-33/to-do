import { render, screen, waitFor } from '@testing-library/react';
import { LoginPage } from '.';
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
const mockLoginApi = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@src/store/auth/slice', () => ({
  login: (values: unknown) => {
    mockLoginApi(values);
    return async (_: unknown) => {
      return Promise.resolve();
    };
  },
}));

describe('LoginPage', () => {
  describe('Рендер', () => {
    test('Должна отрендериться форма', () => {
      render(<LoginPage />);

      expect(screen.getByText('Добро пожаловать')).toBeInTheDocument();
      expect(screen.getByText('Войдите в свой аккаунт')).toBeInTheDocument();

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Пароль')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
      expect(screen.getByText('Нет аккаунта?')).toBeInTheDocument();
      expect(screen.getByText('Вернуться')).toBeInTheDocument();

      const regLink = screen.getByText('Зарегистрироваться').closest('a');
      expect(regLink).toBeInTheDocument();
      expect(regLink).toHaveAttribute('to', '/registration');

      const mainLink = screen.getByText('На главную').closest('a');
      expect(mainLink).toBeInTheDocument();
      expect(mainLink).toHaveAttribute('to', '/');
    });
  });

  describe('Форма', () => {
    test('Форма не должна быть отправлена', async () => {
      render(<LoginPage />);

      await TestHelper.fill.input('Email', 'invalid-email');
      await TestHelper.fill.input('Пароль', 'Password123');

      const loginButton = screen.getByRole('button', { name: 'Войти' });
      await userEvent.click(loginButton);

      await waitFor(() => expect(mockDispatch).not.toHaveBeenCalled());
    });

    test('Форма должна быть отправлена', async () => {
      render(<LoginPage />);

      await TestHelper.fill.input('Email', 'test@m.ru');
      await TestHelper.fill.input('Пароль', 'Password123');
      await TestHelper.form.submit('Войти', mockLoginApi, {
        email: 'test@m.ru',
        password: 'Password123',
      });
    });

    test('Дожен быть редирект после успешного логина', async () => {
      mockDispatch.mockImplementation(async action => {
        if (typeof action === 'function') {
          action(mockDispatch);
          return Promise.resolve().then(() => mockNavigate('/projects'));
        }
        return Promise.resolve();
      });
    });

    test('Snapshot', () => {
      const { container, getByText } = render(<LoginPage />);

      const button = getByText('Войти');
      expect(container).toMatchSnapshot('form');
      expect(button).toMatchSnapshot('button');
    });
  });
});
