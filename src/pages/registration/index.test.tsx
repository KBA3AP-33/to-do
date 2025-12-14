import { render, screen, waitFor } from '@testing-library/react';
import { RegistrationPage } from '.';
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

describe('Рендер', () => {
  test('Рендер формы', () => {
    render(<RegistrationPage />);

    expect(screen.getByText('Создать аккаунт')).toBeInTheDocument();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Повторите пароль')).toBeInTheDocument();

    expect(screen.getByText('Зарегистрироваться')).toBeInTheDocument();
  });
});

describe('Форма', () => {
  test('Ошибока валидации - форма не отправлена', async () => {
    const user = userEvent.setup();

    render(<RegistrationPage />);

    const email = screen.getByLabelText('Email');
    await user.type(email, 'invalid-email');

    const password = screen.getByLabelText('Пароль');
    await user.type(password, 'Password123');

    const passwordConfirm = screen.getByLabelText('Повторите пароль');
    await user.type(passwordConfirm, 'Password123');

    const button = screen.getByText('Зарегистрироваться');
    await user.click(button);

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  test('Форма отправлена', async () => {
    const user = userEvent.setup();

    render(<RegistrationPage />);

    const email = screen.getByLabelText('Email');
    await user.type(email, 'test2@m.ru');

    const password = screen.getByLabelText('Пароль');
    await user.type(password, 'Password123');

    const passwordConfirm = screen.getByLabelText('Повторите пароль');
    await user.type(passwordConfirm, 'Password123');

    const button = screen.getByText('Зарегистрироваться');
    await user.click(button);

    await waitFor(() => {
      expect(mockRegisterApi).toHaveBeenCalledWith({
        email: 'test2@m.ru',
        password: 'Password123',
        passwordConfirm: 'Password123',
      });
    });
  });

  test('После успешной регистрации', async () => {
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
});
