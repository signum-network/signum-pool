import { useEffect } from "react";
import { useAppContext } from "../../../../hooks/useAppContext";
import { poolNodeUrl, signumPriceUrl } from "../../../../../enviroments";
import { formatCapacity } from "../../../../utils/functions/formatCapacity";
import { formatAmount } from "../../../../utils/functions/formatAmount";
import { useAppDispatch } from "../../../../../states/hooks";
import { actions as poolConfigActions } from "../../../../../states/poolConfigState";
import { actions as currentRoundActions } from "../../../../../states/currentRoundState";
import { actions as signumStateActions } from "../../../../../states/signumState";

import {
    actions as minerActions,
    miner as minerInterface,
} from "../../../../../states/minersState";

import useSWR from "swr";

export const PoolDataFetcher = () => {
    const { Fetcher } = useAppContext();
    const { setPoolConfigData } = poolConfigActions;
    const { setCurrentRoundData } = currentRoundActions;
    const { setMinersData } = minerActions;
    const { setSignumData } = signumStateActions;
    const dispatch = useAppDispatch();

    const defaultSWRSettings = {
        refreshInterval: 60000,
        dedupingInterval: 50000,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };

    const { data: poolConfigData, isValidating: isValidatingPoolConfigData } =
        useSWR(poolNodeUrl + "/api/getConfig", Fetcher, defaultSWRSettings);

    const {
        data: currentRoundData,
        isValidating: isValidatingCurrentRoundData,
    } = useSWR(
        poolNodeUrl + "/api/getCurrentRound",
        Fetcher,
        defaultSWRSettings
    );

    const { data: minersData, isValidating: isValidatingMinersData } = useSWR(
        poolNodeUrl + "/api/getMiners",
        Fetcher,
        defaultSWRSettings
    );

    const { data: signumPriceData, isValidating: isValidatingSignumPriceData } =
        useSWR(signumPriceUrl, Fetcher, defaultSWRSettings);

    useEffect(() => {
        if (poolConfigData && !isValidatingPoolConfigData) {
            POPULATE_POOLCONFIG_DATA();
        }
    }, [poolConfigData]);

    useEffect(() => {
        if (currentRoundData && !isValidatingCurrentRoundData) {
            POPULATE_CURRENTROUND_DATA();
        }
    }, [currentRoundData]);

    useEffect(() => {
        if (minersData && !isValidatingMinersData) {
            POPULATE_MINERS_DATA();
        }
    }, [minersData]);

    useEffect(() => {
        if (signumPriceData && !isValidatingSignumPriceData) {
            POPULATE_SIGNUM_PRICE_DATA();
        }
    }, [minersData]);

    // POPULATE FUNCTIONS

    const POPULATE_POOLCONFIG_DATA = () => {
        const info = poolConfigData;

        const payload = {
            isLoading: false,
            poolAccount: info.poolAccount,
            blocksForAverage: info.nAvg,
            blocksToShowAMiner: info.nMin,
            maxDeadline: info.maxDeadline,
            processLag: info.processLag,
            graceDeadlines: info.graceDeadlines,
            feeRecipient: info.feeRecipient,
            poolFeePercentage: info.poolFeePercentage,
            poolSoloFeePercentage: info.poolSoloFeePercentage,
            donationRecipient: info.donationRecipient,
            donationPercent: info.donationPercent,
            defaultPoolShare: info.winnerRewardPercentage,
            defaultMinimumPayout: info.defaultMinimumPayout,
            minimumPayoutAllowed: info.minimumMinimumPayout,
            minimumPayoutsPerTransaction: info.minPayoutsPerTransaction,
            poolPayoutTransactionFee: info.transactionFee,
            version: info.version,
        };

        dispatch(setPoolConfigData(payload));
    };

    const POPULATE_CURRENTROUND_DATA = () => {
        const info = currentRoundData;

        const baseTarget = info.miningInfo.baseTarget;
        const averageCommitmentNQT = info.miningInfo.averageCommitmentNQT;

        const bestDeadline =
            (info.bestDeadline?.name || info.bestDeadline?.minerRS) &&
            info.bestDeadline.deadline
                ? {
                      miner:
                          info.bestDeadline?.name || info.bestDeadline?.minerRS,
                      deadline: info.bestDeadline.deadline,
                  }
                : { miner: "", deadline: 0 };

        const genesisBaseTarget = 4398046511104 / 240;
        const networkDifficulty =
            // @ts-ignore
            formatCapacity(genesisBaseTarget / baseTarget) +
            " + " +
            formatAmount(Math.round(averageCommitmentNQT / 1e8).toFixed(2)) +
            " SIGNA/TiB";

        const payload = {
            isLoading: false,
            roundStart: info.roundStart,
            bestDeadline,
            networkInfo: {
                baseTarget,
                averageCommitmentNQT,
                blockHeight: info.miningInfo.height,
                timestamp: info.miningInfo.timestamp,
                difficulty: networkDifficulty,
            },
        };

        dispatch(setCurrentRoundData(payload));
    };

    const POPULATE_MINERS_DATA = () => {
        const info = minersData;

        const poolMiners: minerInterface[] =
            info.miners && info.miners.length
                ? info.miners.map((miner: any) => ({
                      accountId: miner.address,
                      name: miner?.name || "",
                      pendingBalance: miner.pendingBalance || "",
                      physicalCapacity: miner.totalCapacity || 0,
                      effectiveCapacity: miner.totalEffectiveCapacity || 0,
                      sharedCapacity: miner.sharedCapacity || 0,
                      shareModel: miner.sharePercent || 0,
                      donationPercent: miner.donationPercent || 0,
                      totalCommitment: miner.committedBalance || "",
                      commitmentPerTiB: miner.commitment || "",
                      pocBoost: miner.boost || 0,
                      pocBostPool: miner.boostPool || 0,
                      confirmedDeadlines: miner.nConf || 0,
                      currentRoundBestDeadline:
                          miner.currentRoundBestDeadline || "",
                      poolShare: miner.share || 0,
                      minimumPayout: miner.minimumPayout || "",
                      minerAgent: miner.userAgent || "",
                  }))
                : [];

        const payload = {
            isLoading: false,
            miners: poolMiners,
            totalPhysicalCapacity: info.poolCapacity,
            totalSharedCapacity: info.poolSharedCapacity,
            totalEffectiveCapacity: info.poolTotalEffectiveCapacity,
        };

        dispatch(setMinersData(payload));
    };

    const POPULATE_SIGNUM_PRICE_DATA = () => {
        const info = signumPriceData;

        const payload = {
            isLoading: false,
            price: info.signum.usd,
        };

        dispatch(setSignumData(payload));
    };

    return null;
};
