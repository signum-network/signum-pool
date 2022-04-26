interface Column {
    id: "blockHeight" | "id" | "miner" | "rewardAndFees" | "poolReward";
    label?: string;
    minWidth: number;
    align: "center";
    format?: (value: number) => string;
}

export const columns: readonly Column[] = [
    { id: "blockHeight", align: "center", minWidth: 100 },
    { id: "rewardAndFees", align: "center", minWidth: 100 },
    { id: "miner", align: "center", minWidth: 100 },
    { id: "poolReward", align: "center", minWidth: 100 },
];
