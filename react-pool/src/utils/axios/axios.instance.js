// Native module
import axios from "axios";

// Base url
import { NODEToUse } from "../globalParameters";

const instance = axios.create({
  baseURL: NODEToUse,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default instance;
