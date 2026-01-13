import { theme } from 'antd';
import type { ThemeConfig } from '..';

export const lightThemeConfig: ThemeConfig = {
  token: {
    colorLink: '#ea4b3a',
    colorPrimary: '#ea4b3a',
    colorPrimaryHover: '#d33829',
    colorPrimaryActive: '#d22d1e',

    // custom
    colorCustomPrimary: 'var(--color-custom-primary, #ea4b3a)',
    backgroundCustomPrimary: 'var(--background-custom-primary, #ffffff)',
    colorCustomBlack: 'var(--color-custom-black, #000000)',
    colorProject: '#ea4b3a',
  },
  components: {
    Layout: {
      headerBg: '#f9f9f9',
      bodyBg: '#ffffff',
      siderBg: '#f0f0f0',
    },
    Button: {
      colorBgContainerDisabled: '#e1a9a4ff',
      colorTextDisabled: '#ffffff',
    },
    Menu: {
      subMenuItemBg: '#f0f0f0',
      itemSelectedBg: '#fae7db',
      itemBg: '#f0f0f0',
    },
  },
  algorithm: theme.defaultAlgorithm,
};
