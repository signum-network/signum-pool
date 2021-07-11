import React, { Suspense } from "react";
import ReactDOM from "react-dom";

// App
import App from "./App";

// Global styling
import "./styles/index.css";

// Default modules
import Loading from "./containers/layout/loading/index";

// Translations
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { supportedLangs, fallbackLng } from "./utils/globalLanguages";

// Create translations
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: supportedLangs,
    fallbackLng: fallbackLng,
    debug: false,
    detection: {
      order: ["cookie", "localStorage", "htmlTag"],
      caches: ["cookie", "localStorage"],
    },
    backend: { loadPath: "/assets/locales/{{lng}}/translation.json" },
    react: {
      useSuspense: true,
    },
  });

ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Suspense>,
  document.getElementById("root")
);
