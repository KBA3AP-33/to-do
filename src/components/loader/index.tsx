import { Spin } from 'antd';
import { type ComponentProps, type FC } from 'react';

interface Props extends ComponentProps<'div'> {
  loading?: boolean;
}

export const Loader: FC<Props> = ({ loading, children }) => {
  return loading ? (
    <div data-testid="loader" className="w-full h-full flex justify-center items-center">
      <Spin size="large" />
    </div>
  ) : (
    children
  );
};
