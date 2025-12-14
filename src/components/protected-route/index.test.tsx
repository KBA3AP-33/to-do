import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '.';
import type { RootState } from '@src/store';
import { ROUTES } from '@src/routes';

const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: (selector: RootState['auth']) => mockUseSelector(selector),
}));

jest.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => <div>Redirect to {to}</div>,
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loader', () => {
    mockUseSelector.mockReturnValue({ isLoading: true, user: null });

    render(
      <ProtectedRoute>
        <div>children</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test('children', () => {
    mockUseSelector.mockReturnValue({
      isLoading: false,
      user: { id: '1', email: 'test@m.ru' },
    });

    render(
      <ProtectedRoute>
        <div data-testid="children">children</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('children')).toBeInTheDocument();
  });

  test('redirect', () => {
    mockUseSelector.mockReturnValue({ isLoading: false, user: null });

    const { container } = render(
      <ProtectedRoute>
        <div>children</div>
      </ProtectedRoute>
    );

    expect(container.textContent).toContain(ROUTES.login);
  });
});
