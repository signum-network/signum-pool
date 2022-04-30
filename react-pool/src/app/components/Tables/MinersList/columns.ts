import { isMobile } from "react-device-detect";

interface Column {
    id:
        | "miner"
        | "currentDeadline"
        | "confirmedDeadline"
        | "pendingBalance"
        | "physicalCapacity"
        | "effectiveCapacity"
        | "committedBalance"
        | "pocBoost"
        | "sharedCapacity"
        | "shareModel";
    label?: string;
    minWidth: number;
    align: "center";
    format?: (value: number) => string;
}

const desktopColumns: readonly Column[] = [
    { id: "miner", align: "center", minWidth: 150 },
    {
        id: "currentDeadline",
        align: "center",
        minWidth: 50,
    },
    {
        id: "confirmedDeadline",
        minWidth: 50,
        align: "center",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "pendingBalance",
        minWidth: 50,
        align: "center",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "physicalCapacity",
        minWidth: 50,
        align: "center",
        format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "effectiveCapacity",
        minWidth: 50,
        align: "center",
        format: (value) => value.toFixed(2),
    },
    {
        id: "committedBalance",
        minWidth: 50,
        align: "center",
        format: (value) => value.toFixed(2),
    },
    {
        id: "pocBoost",
        minWidth: 50,
        align: "center",
        format: (value) => value.toFixed(2),
    },
    {
        id: "sharedCapacity",
        minWidth: 50,
        align: "center",
        format: (value) => value.toFixed(2),
    },
    {
        id: "shareModel",
        minWidth: 75,
        align: "center",
        format: (value) => value.toLocaleString("en-US"),
    },
];

const mobileColumns: readonly Column[] = [
    // Miner column
    desktopColumns[0],

    // Pending balance
    desktopColumns[3],

    // Physical Capacity
    desktopColumns[4],

    // Confirmed deadlines
    desktopColumns[2],
];

// Columns which website will specifically show
export const columns = isMobile ? mobileColumns : desktopColumns;
