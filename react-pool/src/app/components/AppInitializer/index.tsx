import { WalletInitializer } from "./WalletInitializer";
import { LanguageInitializer } from "./LanguageInitializer";

// If google MEASUREMENT ID is set, use tracker
import { googleTrackingID } from "../../../enviroments";
import { AnalyticsInitializer } from "./AnalyticsInitializer";

export const AppInitializer = () => {
    return (
        <>
            {googleTrackingID && <AnalyticsInitializer />}

            <LanguageInitializer />
            <WalletInitializer />
        </>
    );
};
