import React from "react";
import "./App.css";
import "./theme";
import { getAppTheme } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import PollCard from "./components/PollCard";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

function App() {
  return (
    <div>
      <NavBar />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <LoginForm />
      </Box>
      <PollCard />
    </div>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
