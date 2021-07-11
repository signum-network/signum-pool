// Import useTestNet variable
import { useTestNet } from "./globalParameters";

// Default extra routes examples with dummy data
// This is for development purposes
// If you want to add custom routes, go to the readme.md
// In the java you must assign that value in just one single line
let defaultUrlRoutes = `{
"links": [{"label":"Example #1 (Signum)", "url":"https://www.signum.network", "newTab": true  },
 {"label":"Example #2 (BTDEX)", "url":"https://btdex.trade", "newTab": true  },
 {"label":"Example #3 (Local page)", "url":"/miners", "newTab": false  }]
}`;

// Example of a menu option links empty
// defaultUrlRoutes = null;

// Production extra routes
// It is going to be received as JSON data
// Pool operator will just need to add the array with its objects
const UrlRoutes =
  window.reactInit.extraPoolUrl &&
  window.reactInit.extraPoolUrl.trim() !== "" &&
  window.reactInit.extraPoolUrl.trim() !== "{}" &&
  window.reactInit.extraPoolUrl.trim() !== "[]" &&
  window.reactInit.extraPoolUrl.trim() !== "{EXTRAPOOLURL}"
    ? `{ "links" :${window.reactInit.extraPoolUrl} }`
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
  EXTRAURLTOUSE.links.map((item) => {
    const objectData = item;

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
