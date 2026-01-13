import { useThemeToken } from '@src/hooks/use-theme-token';

export const Logo = () => {
  const { token } = useThemeToken();

  return (
    <div className="flex items-center space-x-2 cursor-pointer">
      <span className="text-2xl font-bold" style={{ color: token?.colorCustomPrimary }}>
        TaskMaster
      </span>
    </div>
  );
};
