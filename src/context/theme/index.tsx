import _ from 'lodash';
import { ConfigProvider } from 'antd';
import { useEffect, useState, type FC } from 'react';
import { darkThemeConfig } from '@src/theme/dark';
import { lightThemeConfig } from '@src/theme/light';
import { ThemeContext } from '@src/hooks/use-theme';
import { baseConfig } from '@src/theme';

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggle: () => void;
}

export const THEME_KEY = 'theme';

export const ThemeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeContextType['theme']>(() => {
    const value = typeof window !== 'undefined' && localStorage?.getItem(THEME_KEY);
    return (value as ThemeContextType['theme']) || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => {
    setTheme(prev => {
      const value = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') localStorage?.setItem(THEME_KEY, value);
      return value;
    });
  };

  const config = theme === 'light' ? lightThemeConfig : darkThemeConfig;
  const themeConfig = _.merge({}, baseConfig, config);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};
