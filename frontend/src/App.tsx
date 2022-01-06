import React from "react";
import "./App.css";
import "./theme";
import { getAppTheme } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import { QueryClient, QueryClientProvider } from "react-query";

interface UserState {
  loggedIn: boolean;
  username: string;
}

export const UserContext = React.createContext({
  username: "",
  loggedIn: false,
  setUsername: (_: string) => {},
  setLoggedIn: (_: boolean) => {},
});

function App() {
  const loggedInUsername = localStorage.getItem("user");
  const [userState, setUserState] = React.useState<UserState>({
    loggedIn: loggedInUsername !== null,
    username: loggedInUsername ? loggedInUsername : "",
  });

  const userContextValue = React.useMemo(
    () => ({
      username: userState.username,
      loggedIn: userState.loggedIn,
      setUsername: (username: string) => {
        setUserState({ loggedIn: true, username });
      },
      setLoggedIn: (state: boolean) => {
        setUserState({ loggedIn: state, username: "" });
      },
    }),
    [userState]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      <NavBar loggedIn={userState.loggedIn} />
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {userState.loggedIn ? <></> : <LoginForm />}
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
