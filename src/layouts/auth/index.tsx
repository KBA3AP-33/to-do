import type { ComponentProps, FC } from 'react';

export const AuthLayout: FC<ComponentProps<'div'>> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle,_#fef4f4,_#ffe2e2,_#fce2e2)] flex items-center justify-center p-4">
      {children}
    </div>
  );
};
