import React from "react";
import "./App.css";
import "./theme";
import { getAppTheme } from "./theme";
import { Box, Button, CssBaseline, ThemeProvider } from "@mui/material";
import PollCard from "./components/PollCard";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import { QueryClient, QueryClientProvider } from "react-query";
import { api_test_with, logout } from "./api";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    setLoggedIn(loggedInUser !== null);
  }, []);

  return (
    <div>
      <NavBar />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {loggedIn ? (
          <Button
            variant="contained"
            onClick={() => {
              localStorage.removeItem("user");
              logout();
              window.location.reload();
              api_test_with();
            }}
          >
            Logout
          </Button>
        ) : (
          <LoginForm />
        )}
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
  const queryClient = new QueryClient();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
