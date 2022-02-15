import { Routes, Route } from "react-router-dom";
import { Home } from "./home";
import { PoolInfo } from "./poolInfo";

import Custom404 from "./404";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="pool-info" element={<PoolInfo />} />
            <Route path="*" element={<Custom404 />} />
        </Routes>
    );
};
