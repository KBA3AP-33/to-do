import React, { useContext, useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { THEME_KEY, ThemeProvider, type ThemeContextType } from '.';
import { ThemeContext } from '@src/hooks/use-theme';
import userEvent from '@testing-library/user-event';

jest.mock('lodash', () => ({
  merge: jest.fn((obj, ...sources) => ({ ...obj, ...sources.reduce((acc, src) => ({ ...acc, ...src }), {}) })),
}));

jest.mock('@src/theme/dark', () => ({
  darkThemeConfig: { test: true },
}));

jest.mock('@src/theme/light', () => ({
  lightThemeConfig: { test: false },
}));

jest.mock('@src/theme', () => ({
  baseConfig: { base: true },
}));

describe('ThemeProvider', () => {
  const Test: React.FC = () => {
    const themeContext = React.useContext(ThemeContext) as ThemeContextType;
    return (
      <div>
        <div data-testid="theme">{themeContext.theme}</div>
        <button onClick={themeContext.toggle}>Toggle</button>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Init state', () => {
    test('Дефолтная тема', () => {
      render(
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
    });

    test('Init из localStorage', () => {
      localStorage.setItem(THEME_KEY, 'dark');

      render(
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    });

    test('Атрибут data-theme', () => {
      render(
        <ThemeProvider>
          <div>Test</div>
        </ThemeProvider>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('Init', () => {
      const results: Array<ThemeContextType> = [];

      const Test = () => {
        const context = useContext(ThemeContext) as ThemeContextType;
        useEffect(() => {
          results.push(context);
        }, [context]);

        return null;
      };

      render(
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      );

      expect(results[0]).toEqual({
        theme: 'light',
        toggle: expect.any(Function),
      });
    });
  });

  describe('Переключение тем', () => {
    test('light -> dark', async () => {
      render(
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      await userEvent.click(button);

      expect(screen.getByTestId('theme')).toHaveTextContent('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('dark -> light', async () => {
      localStorage.setItem('theme', 'dark');

      render(
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: 'Toggle' });
      await userEvent.click(button);

      expect(screen.getByTestId('theme')).toHaveTextContent('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('Сохранение в localStorage', async () => {
      render(
        <ThemeProvider>
          <Test />
        </ThemeProvider>
      );

      const button = screen.getByRole('button', { name: 'Toggle' });

      await userEvent.click(button);
      expect(localStorage.getItem('theme')).toBe('dark');

      await userEvent.click(button);
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });
});
