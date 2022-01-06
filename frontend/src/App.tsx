import React from "react";
import "./App.css";
import "./theme";
import { getAppTheme } from "./theme";
import { Box, Button, CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import { QueryClient, QueryClientProvider } from "react-query";
import { logout } from "./api";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  React.useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    setLoggedIn(loggedInUser !== null);
  }, []);

  return (
    <div>
      <NavBar loggedIn={loggedIn} />
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
            }}
          >
            Logout
          </Button>
        ) : (
          <LoginForm />
        )}
      </Box>
    </div>
  );
}

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export default function AppContextProvider() {
  const [mode, setMode] = React.useState<"dark" | "light">(
    localStorage.getItem("theme") == "light" ? "light" : "dark"
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const currMode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("theme", currMode);
          return currMode;
        });
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
