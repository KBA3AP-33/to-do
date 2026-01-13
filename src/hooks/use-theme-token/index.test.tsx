import { renderHook, act, render } from '@testing-library/react';
import { theme } from 'antd';
import type { ThemeConfig } from '@src/theme';
import { useThemeToken } from '.';

jest.mock('antd', () => ({
  theme: {
    useToken: jest.fn(),
  },
}));

const mockAntdTheme = theme as jest.Mocked<typeof theme>;

describe('useThemeToken', () => {
  const mockToken: ThemeConfig['token'] = {
    colorPrimary: '#ff0000',
    colorBgBase: '#00ff00',
    colorTextBase: '#0000ff',
    test: 'test',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockUseTokenResult: any = {
    token: mockToken,
    theme: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAntdTheme.useToken.mockReturnValue(mockUseTokenResult);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Базовые тесты', () => {
    test('Создание токена', () => {
      const { result } = renderHook(() => useThemeToken());

      expect(result.current).toEqual({ token: mockToken });
      expect(mockAntdTheme.useToken).toHaveBeenCalledTimes(1);
    });

    test('Структура токена', () => {
      const { result } = renderHook(() => useThemeToken());

      expect(result.current.token).toHaveProperty('colorPrimary');
      expect(result.current.token).toHaveProperty('colorBgBase');
      expect(result.current.token).toHaveProperty('colorTextBase');

      expect(typeof result.current.token?.colorPrimary).toBe('string');
      expect(typeof result.current.token?.colorBgBase).toBe('string');
      expect(typeof result.current.token?.colorTextBase).toBe('string');
      expect(typeof result.current.token?.test).toBe('string');
    });

    test('Перезапись токена', () => {
      const diffMockToken: ThemeConfig['token'] = {
        colorPrimary: '#ffffff',
        colorBgBase: '#000000',
        colorTextBase: '#333333',
        test: 'test1',
      };

      mockAntdTheme.useToken.mockReturnValue({
        ...mockUseTokenResult,
        token: diffMockToken,
      });

      const { result } = renderHook(() => useThemeToken());
      expect(result.current.token).toEqual(diffMockToken);
    });

    test('Изменение токена', () => {
      const { result, rerender } = renderHook(() => useThemeToken());
      const initialToken = result.current.token;

      const newToken = { ...mockToken, colorPrimary: '#fff000' };
      mockAntdTheme.useToken.mockReturnValue({
        ...mockUseTokenResult,
        token: newToken,
      });

      rerender();

      expect(result.current.token).not.toBe(initialToken);
      expect(result.current.token?.colorPrimary).toBe('#fff000');
    });

    test('Несколько хуков', () => {
      const { result: result1 } = renderHook(() => useThemeToken());
      const { result: result2 } = renderHook(() => useThemeToken());

      expect(result1.current).toEqual(result2.current);
      expect(mockAntdTheme.useToken).toHaveBeenCalledTimes(2);
    });
  });

  describe('Пустые тесты', () => {
    test('should handle empty or minimal token object', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockAntdTheme.useToken.mockReturnValue({ token: {}, theme: {} } as any);

      const { result } = renderHook(() => useThemeToken());
      expect(result.current.token).toEqual({});
    });

    test('null', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockAntdTheme.useToken.mockReturnValue({ token: null, theme: null } as any);
      expect(() => renderHook(() => useThemeToken())).not.toThrow();
    });
  });

  describe('Интеграционные тесты', () => {
    test('should provide tokens to consuming component', () => {
      const Test = () => {
        const { token } = useThemeToken();
        return <div style={{ color: token?.colorPrimary }}>Test</div>;
      };

      const { container } = render(<Test />);

      const div = container.querySelector('div');
      expect(div?.style.color).toBe('rgb(255, 0, 0)');
    });

    test('Ререндер компонента', () => {
      let count = 0;

      const Test = () => {
        count++;
        const { token } = useThemeToken();
        return <div style={{ color: token?.colorPrimary }}>Test</div>;
      };

      const { rerender } = render(<Test />);

      const initialRenderCount = count;
      const newToken = { ...mockToken, colorPrimary: '#ffff00' };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockAntdTheme.useToken.mockReturnValue({ token: newToken, theme: {} } as any);

      rerender(<Test />);
      expect(count).toBeGreaterThan(initialRenderCount);
    });
  });
});
