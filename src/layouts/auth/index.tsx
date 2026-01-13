import { ThemeSwitcher } from '@src/containers/theme-switcher';
import { useThemeToken } from '@src/hooks/use-theme-token';
import type { ComponentProps, FC } from 'react';

export const AuthLayout: FC<ComponentProps<'div'>> = ({ children }) => {
  const { token } = useThemeToken();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: token?.backgroundCustomPrimary }}
    >
      {children}
      <div className="absolute top-0 right-0 px-1">
        <ThemeSwitcher />
      </div>
    </div>
  );
};
