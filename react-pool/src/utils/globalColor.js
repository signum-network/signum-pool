// Import test net
import { useTestNet } from "./globalParameters";

//Default colors
const defaultColors = {
  primary: {
    main: "#0099ff",
    light: "#5fb8ff",
    dark: "#0066ff",
  },
  secondary: {
    main: "#183173",
    light: "#274187",
    dark: "#021851",
    contrastText: "#ffffff",
  },
};

// Custom colors
const customColors = {
  primary: {
    main: window.reactInit.primaryColor,
    light: window.reactInit.primaryLightColor,
    dark: window.reactInit.primaryDarkColor,
    contrastText: "#ffffff",
  },
  secondary: {
    main: window.reactInit.secondaryColor,
    light: window.reactInit.secondaryLightColor,
    dark: window.reactInit.secondaryDarkColor,
  },
};

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Determine if pool operator wants to use custom colors
export const COLORSTOUSE =
  useTestNet && useTestNet === true ? defaultColors : customColors;

// Default graph color
export const DEFAULTGRAPHCOLORTOUSE =
  useTestNet && useTestNet === true ? "#2451B7" : window.reactInit.graphColor;
