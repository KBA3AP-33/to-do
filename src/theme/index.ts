import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    colorLink: '#ea4b3a',
    colorPrimary: '#ea4b3a',
    colorPrimaryHover: '#d33829',
    colorPrimaryActive: '#d22d1e',
  },
  components: {
    Layout: {
      headerBg: '#f9f9f9',
      bodyBg: '#ffffff',
      headerPadding: '0',
      headerHeight: 50,
      siderBg: '#f0f0f0',
    },
    Form: {
      itemMarginBottom: 12,
      fontWeightStrong: 600,
    },
    Button: {
      colorBgContainerDisabled: '#e1a9a4ff',
      colorTextDisabled: '#ffffff',
    },
    Menu: {
      subMenuItemBg: '#f0f0f0',
      itemBg: '#f0f0f0',
      itemSelectedBg: '#fae7db',
    },
    Typography: {
      fontWeightStrong: 700,
    },
  },
};
