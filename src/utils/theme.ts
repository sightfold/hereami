"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#161616", contrastText: "#ffffff" },
        secondary: { main: "#6b6a65" },
        success: { main: "#15803d" },
        warning: { main: "#c2410c" },
        error: { main: "#dc2626" },
        background: { default: "#ffffff", paper: "#ffffff" },
        text: { primary: "#161616", secondary: "#6b6a65" },
        divider: "#e7e5df",
      },
    },
    dark: {
      palette: {
        primary: { main: "#f5f4f0", contrastText: "#121212" },
        secondary: { main: "#a3a29c" },
        success: { main: "#4ade80" },
        warning: { main: "#fb923c" },
        error: { main: "#f87171" },
        background: { default: "#0c0c0d", paper: "#161618" },
        text: { primary: "#f5f4f0", secondary: "#a3a29c" },
        divider: "#2a2a2d",
      },
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
  },
});

export default theme;
