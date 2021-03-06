import { Box, CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import LoginForm from "./components/LoginForm";
import NavBar from "./components/NavBar";
import PollsPage from "./components/PollsPage";
import { useJwt } from "react-jwt";
import "./theme";
import { getAppTheme } from "./theme";

const drawerWidth = 240;

interface UserState {
  username: string | null;
  jwt: string | null;
}

interface Credentials {
  username: string;
  password: string;
}

export const UserContext = React.createContext<
  UserState & { setUserContext: (_: string | null) => void }
>({
  username: null,
  jwt: null,
  setUserContext: (_) => {},
});

function App() {
  const theme = useTheme();
  const authString = localStorage.getItem("jwt");
  const { decodedToken, isExpired } = useJwt(authString!!);
  const [refresh, setRefresh] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [userState, setUserState] = React.useState<UserState>({
    username: null,
    jwt: authString,
  });

  React.useEffect(() => {
    if (!!decodedToken && !userState.username) {
      setUserState({
        ...userState,
        username: (decodedToken as Credentials).username,
      });
    }
  }, [decodedToken, isExpired, userState]);

  const userContextValue = React.useMemo(
    () => ({
      username: userState.username,
      jwt: userState.jwt,
      setUserContext: (jwt: string | null) => {
        setUserState({
          username: decodedToken && (decodedToken as Credentials).username,
          jwt,
        });
      },
    }),
    [decodedToken, userState]
  );

  return (
    <UserContext.Provider value={userContextValue}>
      <Box
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        {...(menuOpen && {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        })}
      >
        <NavBar {...{ menuOpen, setMenuOpen, setRefresh }} />
        {userState.jwt ? (
          <PollsPage {...{ refresh, setRefresh }} />
        ) : (
          <LoginForm />
        )}
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
