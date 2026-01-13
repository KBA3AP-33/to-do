import { theme } from 'antd';
import type { ThemeConfig } from '@src/theme';

export const useThemeToken = () => {
  return {
    token: theme.useToken().token as ThemeConfig['token'],
  };
};
