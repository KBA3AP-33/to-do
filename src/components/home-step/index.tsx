import { useThemeToken } from '@src/hooks/use-theme-token';
import { type FC } from 'react';

interface Props {
  num: number;
  title: string;
  subtitle: string;
}

export const HomeStep: FC<Props> = ({ num, title, subtitle }) => {
  const { token } = useThemeToken();

  return (
    <div className="text-center p-6">
      <div
        className="text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6"
        style={{ backgroundColor: token?.colorCustomPrimary }}
      >
        {num}
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};
