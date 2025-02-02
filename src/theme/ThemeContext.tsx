import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

type ThemeContextType = {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  mode: 'light'
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
        typography: {
          fontFamily: 'Inter, system-ui, sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = { toggleTheme, mode };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}