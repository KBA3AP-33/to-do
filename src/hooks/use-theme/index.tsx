import type { ThemeContextType } from '@src/context/theme';
import { createContext, useContext } from 'react';

export const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggle: () => {} });

export const useTheme = () => {
  return useContext(ThemeContext);
};
