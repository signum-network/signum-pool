// Import useTestNet variable
import { useTestNet } from "./globalParameters";

//Default extra routes examples with dummy data
let defaultUrlRoutes = `{
  "a":{"label":"Example #1 (Signum)", "url":"https://www.signum.network", "newTab": true  },
  "b":{"label":"Example #2 (BTDEX)", "url":"https://btdex.trade", "newTab": true  },
  "c":{"label":"Example #3 (Local page)", "url":"/miners", "newTab": false  }
}`;

// Example of a menu option links empty
// defaultUrlRoutes = null;

// Production extra routes
const UrlRoutes =
  window.reactInit.extraPoolUrl &&
  window.reactInit.extraPoolUrl.trim() !== "" &&
  window.reactInit.extraPoolUrl.trim() !== "{}" &&
  window.reactInit.extraPoolUrl.trim() !== "{EXTRAPOOLURL}"
    ? window.reactInit.extraPoolUrl
    : null;

const EXTRAURLTOUSE =
  useTestNet && useTestNet === true
    ? JSON.parse(defaultUrlRoutes) || null
    : JSON.parse(UrlRoutes) || null;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Extra routes formating
export let extraLinksArrayExport = [];

// Check if pool operator typed extra links
if (EXTRAURLTOUSE && EXTRAURLTOUSE !== {}) {
  Object.keys(EXTRAURLTOUSE).map(function (key, index) {
    const objectData = EXTRAURLTOUSE[key];

    // Check if the keys label, url and newTab exists
    if (
      // Label verification
      !objectData.label ||
      objectData.label.trim() === "" ||
      // Url verification
      !objectData.url ||
      objectData.url.trim() === "" ||
      // newTab verification
      (objectData.newTab !== true && objectData.newTab !== false)
    ) {
      return false;
    }

    return extraLinksArrayExport.push(objectData);
  });
}
