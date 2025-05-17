import { createContext, useContext, useState, ReactNode } from 'react';

type ThemeType = 'mountains' | 'beaches' | 'cities';

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themeColors: {
    mountains: { primary: string; secondary: string; accent: string };
    beaches: { primary: string; secondary: string; accent: string };
    cities: { primary: string; secondary: string; accent: string };
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('mountains');

  const themeColors = {
    mountains: {
      primary: 'slate-800',
      secondary: 'indigo-600',
      accent: 'amber-500',
    },
    beaches: {
      primary: 'sky-500',
      secondary: 'amber-100',
      accent: 'coral-400',
    },
    cities: {
      primary: 'gray-900',
      secondary: 'yellow-400',
      accent: 'purple-600',
    },
  };

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}
