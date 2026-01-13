import { useRouter } from '.';
import { renderHook } from '@testing-library/react';
import { createBrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  createBrowserRouter: jest.fn(),
}));

jest.mock('@src/pages/error', () => ({
  ErrorPage: 'ErrorPageComponent',
}));

jest.mock('@src/routes/config', () => ({
  routes: [
    { path: '/', element: 'HomeComponent' },
    { path: '/about', element: 'AboutComponent' },
    { path: '/test', element: 'TestComponent' },
  ],
}));

describe('useRouter', () => {
  const mockCreateBrowserRouter = createBrowserRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateBrowserRouter.mockReturnValue('mock-router');
  });

  describe('Базовые тесты', () => {
    test('Рендер', () => {
      const { result } = renderHook(() => useRouter());

      expect(createBrowserRouter).toHaveBeenCalledTimes(1);
      expect(result.current).toBe('mock-router');
    });

    test('Создание роутера с ErrorBoundary', () => {
      const { result } = renderHook(() => useRouter());

      expect(createBrowserRouter).toHaveBeenCalledWith([
        { path: '/', element: 'HomeComponent', ErrorBoundary: 'ErrorPageComponent' },
        { path: '/about', element: 'AboutComponent', ErrorBoundary: 'ErrorPageComponent' },
        { path: '/test', element: 'TestComponent', ErrorBoundary: 'ErrorPageComponent' },
      ]);

      expect(result.current).toBe('mock-router');
    });

    test('Мемоизация', () => {
      const { result, rerender } = renderHook(() => useRouter());
      const router = result.current;

      rerender();
      rerender();

      expect(createBrowserRouter).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(router);
    });

    test('ErrorBoundary для всех роутов', () => {
      jest.isolateModules(() => {
        jest.doMock('@src/routes/config', () => ({
          routes: [
            { path: '/route1', element: 'Component1' },
            { path: '/route2', element: 'Component2' },
            { path: '/route3', element: 'Component3' },
          ],
        }));

        renderHook(() => useRouter());
        const routes = mockCreateBrowserRouter.mock.calls[0][0];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        routes.forEach((route: any) => {
          expect(route.ErrorBoundary).toBe('ErrorPageComponent');
        });
      });
    });
  });

  describe('Пустые', () => {
    test('Error', () => {
      const error = 'Router creation failed';

      mockCreateBrowserRouter.mockImplementation(() => {
        throw new Error(error);
      });

      expect(() => renderHook(() => useRouter())).toThrow(error);
    });
  });

  describe('Интеграционные', () => {
    test('Структура роутов', () => {
      jest.isolateModules(() => {
        jest.doMock('@src/routes/config', () => ({
          routes: [
            {
              path: '/',
              element: 'LayoutComponent',
              children: [
                { index: true, element: 'HomeComponent' },
                {
                  path: 'products',
                  element: 'ProductsLayout',
                  children: [
                    { index: true, element: 'ProductList' },
                    { path: ':id', element: 'ProductDetail' },
                  ],
                },
              ],
            },
          ],
        }));

        renderHook(() => useRouter());
        const routes = mockCreateBrowserRouter.mock.calls[0][0];

        expect(routes[0].ErrorBoundary).toBe('ErrorPageComponent');
        expect(routes[0].children?.[1]?.ErrorBoundary).toBeUndefined();
      });
    });
  });
});
