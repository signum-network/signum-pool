// Here will be functions related to the blockchain
import { genesisBaseTarget, EXPLORERToUse } from "../globalParameters";
import { thousands_separators, escapeHtml } from "./normal";

// Format capacity
export const formatCapacity = (capacity) => {
  let capacityFloat = parseFloat(capacity);

  if (capacityFloat > 1024)
    return thousands_separators((capacityFloat / 1024).toFixed(3)) + " PiB";

  return thousands_separators(parseFloat(capacity).toFixed(3)) + " TiB";
};

// Format base target
export const formatBaseTarget = (baseTarget) => {
  return formatCapacity(genesisBaseTarget / baseTarget);
};

// Format time
export const formatTime = (secs) => {
  // Check if secs has a valid value
  if (secs && secs !== null && secs !== undefined && !isNaN(secs)) {
    const filterTimePart = (part, suffix) => {
      if (part === 0) {
        part = null;
      } else {
        part = part.toString() + suffix;
      }
      return part;
    };

    secs = parseInt(secs, 10);
    if (secs === null || secs < 0) return "";
    if (secs === 0) return "0s";
    let years = filterTimePart(Math.floor(secs / 3600 / 24 / 365), "y");
    let days = filterTimePart(Math.floor((secs / 3600 / 24) % 365), "d");
    let hours = filterTimePart(Math.floor((secs / 3600) % 24), "h");
    let minutes = filterTimePart(Math.floor(secs / 60) % 60, "m");
    let seconds = filterTimePart(secs % 60, "s");

    let result = "";
    if (years !== null) result += " " + years;
    if (days !== null) result += " " + days;
    if (hours !== null) result += " " + hours;
    if (minutes !== null) result += " " + minutes;
    if (seconds !== null) result += " " + seconds;
    return result.substr(1);
  } else {
    return "Waiting...";
  }
};

// Format miner name
export const formatMinerName = (
  explorer,
  rs,
  id,
  name = null,
  includeLink = false
) => {
  rs = escapeHtml(rs);
  if (includeLink) {
    return (
      '<a rel="noreferrer" href="' +
      getAccountExplorerLink(explorer, id) +
      '" target="_blank">' +
      (name === null || name === "" ? rs : name) +
      "</a>"
    );
  }
  return !name || name === null || name === "" ? rs : name;
};

// Get account explorer link
export const getAccountExplorerLink = (explorer, id) => {
  return explorer + id;
};

// Open explorer in a new tab
export const openAccountInExplorer = (accountId) => {
  window.open(`${EXPLORERToUse}?action=account&account=${accountId}`, "_blank");
};
