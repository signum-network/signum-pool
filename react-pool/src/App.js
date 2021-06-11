// React
import React, { Fragment } from "react";

// Routing
import { BrowserRouter } from "react-router-dom";

// Material palette
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// Redux
import { Provider } from "react-redux";
import store from "./utils/redux/store";

// Route renderer
import Routes from "./Routes";

const App = () => {
  // Material template setup
  const prefersDarkMode = "dark";

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          primary: {
            main: "#0099ff",
            light: "#5fb8ff",
            dark: "#0066ff",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#E8F3FF",
            light: "#EAF0F6",
            dark: "#021851",
          },
          type: prefersDarkMode,
        },
      }),
    [prefersDarkMode]
  );

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Fragment>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes />
          </ThemeProvider>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
