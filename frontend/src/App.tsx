import React from "react";
import "./App.css";
import "./theme";
import { getAppTheme } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import { QueryClient, QueryClientProvider } from "react-query";

interface UserState {
  username: string;
  basicAuth: string;
}

export const UserContext = React.createContext({
  username: "",
  basicAuth: "",
  setUserContext: (_: string) => {},
});

function App() {
  const authString = localStorage.getItem("basicAuth");
  const [userState, setUserState] = React.useState<UserState>({
    username: authString ? window.atob(authString).split(":")[0] : "",
    basicAuth: authString ? authString : "",
  });

  const userContextValue = React.useMemo(
    () => ({
      username: userState.username,
      basicAuth: userState.basicAuth,
      setUserContext: (basicAuth: string) => {
        setUserState({
          username: basicAuth ? window.atob(basicAuth).split(":")[0] : "",
          basicAuth,
        });
      },
    }),
    [userState]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      <NavBar loggedIn={userState.basicAuth !== ""} />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {userState.basicAuth !== "" ? <></> : <LoginForm />}
      </Box>
    </UserContext.Provider>
  );
}

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export default function AppContextProvider() {
  const [mode, setMode] = React.useState<"dark" | "light">(
    localStorage.getItem("theme") === "light" ? "light" : "dark"
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
