import React from "react";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import AppRouter from "./router";
import { theme } from './theme/theme';
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
