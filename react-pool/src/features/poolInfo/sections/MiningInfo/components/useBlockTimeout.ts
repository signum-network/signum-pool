import { useEffect, useRef, useState } from "react";
import { formatTime } from "../../../../../app/utils/functions/formatTime";

// '...' means that we are waiting for the render of the block elapsed time

export const useBlockTimeout = (roundStart: number): string | "..." => {
    const [blockDuration, updateblockDuration] = useState("...");

    let intervalHandle = useRef<ReturnType<typeof setTimeout>>();
    const resetTimeout = () => {
        intervalHandle.current && clearInterval(intervalHandle.current);
    };

    useEffect(() => {
        if (!roundStart) return;
        resetTimeout();

        intervalHandle.current = setInterval(() => {
            const elapsedTime = formatTime(
                parseInt((new Date().getTime() / 1000).toFixed()) - roundStart
            );

            if (!elapsedTime) updateblockDuration("...");

            updateblockDuration(elapsedTime);
        }, 1000);

        return () => {
            resetTimeout();
        };
    }, [roundStart]);

    return blockDuration;
};
