import React from "react";
import { hot } from "react-hot-loader/root";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactQueryDevtools } from "react-query-devtools";
import Dashboard from "./Dashboard";
import { useChallenges, usePlayerList } from "./hooks";
import { AppContext } from "./contexts";
import {
  AppBar,
  Box,
  CircularProgress,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import Footer from "./Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  loadingText: { marginLeft: theme.spacing(2) },
  appBarSpacer: theme.mixins.toolbar,
}));

function App() {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const challenges = useChallenges();
  const players = usePlayerList();

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#d32f2f",
          },
          secondary: red,
        },
      }),
    [prefersDarkMode]
  );

  const isLoading = challenges.isLoading && players.isLoading;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoading ? (
        <Box
          display="flex"
          flexDirection=""
          alignItems="center"
          minHeight="100vh"
          justifyContent="center"
        >
          <CircularProgress />
          <Typography variant="caption" className={classes.loadingText}>
            Loading challenges and players...
          </Typography>
        </Box>
      ) : (
        <AppContext.Provider value={{ challenges, players }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <Typography variant="h6" color="inherit">
                DR2 Monthly Challenges
              </Typography>
            </Toolbar>
          </AppBar>
          <Dashboard className={classes.appBarSpacer} />
          <Footer />
        </AppContext.Provider>
      )}

      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </ThemeProvider>
  );
}

export default process.env.NODE_ENV === "development" ? hot(App) : App;
