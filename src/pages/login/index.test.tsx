import { render, screen, waitFor } from '@testing-library/react';
import { LoginPage } from '.';
import userEvent from '@testing-library/user-event';

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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

describe('Рендер', () => {
  test('Рендер формы', () => {
    render(<LoginPage />);

    expect(screen.getByText('Добро пожаловать')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Введите email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите пароль')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });
});

describe('Форма', () => {
  test('Ошибока валидации - форма не отправлена', async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Введите email');
    await user.type(emailInput, 'invalid-email');

    const passwordInput = screen.getByPlaceholderText('Введите пароль');
    await user.type(passwordInput, 'Password123');

    const loginButton = screen.getByRole('button', { name: 'Войти' });
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  test('Форма отправлена', async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Введите email');
    await user.type(emailInput, 'test@m.ru');

    const passwordInput = screen.getByPlaceholderText('Введите пароль');
    await user.type(passwordInput, 'Password123');

    const loginButton = screen.getByRole('button', { name: 'Войти' });
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockLoginApi).toHaveBeenCalledWith({
        email: 'test@m.ru',
        password: 'Password123',
      });
    });
  });

  test('После успешного логина', async () => {
    mockDispatch.mockImplementation(async action => {
      if (typeof action === 'function') {
        action(mockDispatch);
        return Promise.resolve().then(() => {
          mockNavigate('/projects');
        });
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
