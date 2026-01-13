import { theme } from 'antd';
import type { ThemeConfig } from '..';

export const darkThemeConfig: ThemeConfig = {
  token: {
    colorLink: '#f97316',
    colorPrimary: '#f97316',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorPrimaryHover: '#fb923c',
    colorPrimaryActive: '#ea580c',
    colorLinkHover: '#fb923c',
    colorBgBase: '#1c1917',
    colorBgContainer: '#292524',
    colorBgElevated: '#44403c',
    colorBorder: '#57534e',
    colorBorderSecondary: '#44403c',

    // custom
    colorCustomPrimary: 'var(--color-custom-primary, #f97316)',
    backgroundCustomPrimary: 'var(--background-custom-primary, #1c1917)',
    colorCustomBlack: 'var(--color-custom-black, #ffffff)',
    colorProject: '#f97316',
  },
  components: {
    Layout: {
      headerBg: '#292524',
      bodyBg: '#1c1917',
      siderBg: '#292524',
      footerBg: '#292524',
    },
    Menu: {
      darkItemBg: '#292524',
      darkSubMenuItemBg: '#292524',
      darkItemColor: '#e7e5e4',
      darkItemSelectedBg: '#f97316',
      darkItemSelectedColor: '#ffffff',
      darkItemHoverBg: '#44403c',
      darkItemHoverColor: '#ffffff',
    },
    Input: {
      colorTextPlaceholder: '#a8a29e',
      colorBgContainer: '#292524',
      colorBorder: '#57534e',
      colorText: '#fafaf9',
    },
    Form: {
      labelColor: '#e7e5e4',
    },
    Typography: {
      colorTextHeading: '#fafaf9',
      colorText: '#fafaf9',
    },
    Divider: {
      colorSplit: '#57534e',
    },
    Modal: {
      contentBg: '#292524',
      headerBg: '#292524',
      titleColor: '#fafaf9',
    },
    Select: {
      selectorBg: '#292524',
      optionSelectedBg: '#44403c',
    },
  },
  algorithm: theme.darkAlgorithm,
};
