import { WalletInitializer } from "./WalletInitializer";
import { LanguageInitializer } from "./LanguageInitializer";

export const AppInitializer = () => (
    <>
        <LanguageInitializer />
        <WalletInitializer />
    </>
);
