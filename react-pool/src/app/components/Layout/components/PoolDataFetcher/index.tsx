import { useEffect } from "react";
import { useAppContext } from "../../../../hooks/useAppContext";
import { poolNodeUrl } from "../../../../../enviroments";
import { useAppDispatch } from "../../../../../states/hooks";
import { actions as poolConfigActions } from "../../../../../states/poolConfigState";
import { actions as currentRoundActions } from "../../../../../states/currentRoundState";
import { actions as minerActions } from "../../../../../states/minersState";

import useSWR from "swr";

export const PoolDataFetcher = () => {
    const { Fetcher } = useAppContext();
    const { setPoolConfigData } = poolConfigActions;
    const { setCurrentRoundData } = currentRoundActions;
    const { setMinersData } = minerActions;
    const dispatch = useAppDispatch();

    const defaultSWRSettings = {
        refreshInterval: 60000,
        dedupingInterval: 50000,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };

    const { data: poolConfigData, isValidating: isValidatingPoolConfigData } =
        useSWR(poolNodeUrl + "api/getConfig", Fetcher, defaultSWRSettings);

    const {
        data: currentRoundData,
        isValidating: isValidatingCurrentRoundData,
    } = useSWR(
        poolNodeUrl + "api/getCurrentRound",
        Fetcher,
        defaultSWRSettings
    );

    const { data: minersData, isValidating: isValidatingMinersData } = useSWR(
        poolNodeUrl + "api/getMiners",
        Fetcher,
        defaultSWRSettings
    );

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

    const POPULATE_POOLCONFIG_DATA = () => {
        // dispatch(setPoolConfigData({ loading: false }));
    };

    const POPULATE_CURRENTROUND_DATA = () => {
        console.log(currentRoundData);
    };

    const POPULATE_MINERS_DATA = () => {
        console.log(minersData);
    };

    return <></>;
};
