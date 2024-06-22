import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource-variable/montserrat";

import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./states/store";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <ReduxProvider store={store}>
                <App />
            </ReduxProvider>
        </BrowserRouter>
    </React.StrictMode>
);
