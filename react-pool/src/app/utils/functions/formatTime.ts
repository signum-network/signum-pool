export const formatTime = (secs: number): string | "waiting..." => {
    if (secs && secs !== null && secs !== undefined && !isNaN(secs)) {
        const filterTimePart = (part: any, suffix: any) => {
            if (part === 0) {
                part = null;
            } else {
                part = part.toString() + suffix;
            }
            return part;
        };

        secs = parseInt(secs.toLocaleString(), 10);
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
        return "waiting...";
    }
};
