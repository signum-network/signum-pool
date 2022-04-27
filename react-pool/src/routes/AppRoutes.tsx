import { Routes, Route } from "react-router-dom";
import { Home } from "./home";
import { PoolInfo } from "./poolInfo";
import { Miners } from "./miners";
import { SpecificMiner } from "./miners/specificMiner";
import { Trading } from "./trading";

import Custom404 from "./404";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="pool-info" element={<PoolInfo />} />
            <Route path="miners" element={<Miners />} />
            <Route path="miner/:accountId" element={<SpecificMiner />} />
            <Route path="trading-view" element={<Trading />} />
            <Route path="*" element={<Custom404 />} />
        </Routes>
    );
};
