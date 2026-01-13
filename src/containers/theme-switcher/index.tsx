import { Switch } from 'antd';
import { useTheme } from '@src/hooks/use-theme';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

export const ThemeSwitcher = () => {
  const { theme, toggle } = useTheme();
  return (
    <Switch
      checkedChildren={<SunOutlined />}
      unCheckedChildren={<MoonOutlined />}
      value={theme === 'light'}
      onChange={toggle}
    />
  );
};
