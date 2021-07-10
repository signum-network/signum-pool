// React
import React, { Fragment } from "react";

// Routing
import { BrowserRouter } from "react-router-dom";

// Material palette
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// Redux
import { Provider } from "react-redux";
import store from "./utils/redux/store";

// Route renderer
import Routes from "./Routes";

// Color manipulation
import { COLORSTOUSE } from "./utils/globalColor";

const App = () => {
  // Material template setup
  const prefersDarkMode = "dark";

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          ...COLORSTOUSE,
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
