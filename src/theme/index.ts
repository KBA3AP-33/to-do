import type { ThemeConfig as ThemeConfigType } from 'antd';

export interface ThemeConfig extends Omit<ThemeConfigType, 'token'> {
  token?: ThemeConfigType['token'] & Record<string, string>;
}

export const baseConfig: ThemeConfig = {
  components: {
    Layout: {
      headerPadding: 0,
      headerHeight: 50,
    },
    Form: {
      itemMarginBottom: 12,
      fontWeightStrong: 600,
    },
    Typography: {
      fontWeightStrong: 700,
    },
  },
};
