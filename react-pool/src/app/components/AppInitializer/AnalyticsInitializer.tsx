import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { googleTrackingID, isDevelopmentMode } from "../../../enviroments";

import ReactGA from "react-ga4";

export const AnalyticsInitializer = () => {
    const location = useLocation();
    const [canTrack, setCanTrack] = useState(false);

    const initiateAnalytics = async () => {
        await ReactGA.initialize(googleTrackingID, {
            gtagOptions: { debug_mode: isDevelopmentMode },
        });

        setCanTrack(true);
    };

    useEffect(() => {
        if (googleTrackingID) {
            initiateAnalytics();
        }
    }, []);

    useEffect(() => {
        if (canTrack)
            ReactGA.send({
                hitType: "pageview",
                page: location.pathname + location.search + location.hash,
            });
    }, [location.pathname, canTrack]);

    return null;
};
