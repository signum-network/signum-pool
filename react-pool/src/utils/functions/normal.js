// Normal functions

// Add comma to numbers
export const thousands_separators = (x) => {
  return x.toString().replace(/^[+-]?\d+/, function (int) {
    return int.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  });
};

// Escape html
export const escapeHtml = (string) => {
  const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return typeof string === "string"
    ? String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
      })
    : string;
};
