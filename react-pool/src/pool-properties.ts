import * as devProperties from "./pool-dev-properties";
import * as prodProperties from "./pool-prod-properties";

const isTestNet = process.env.NODE_ENV === "development";

const { poolName, colors } = isTestNet ? devProperties : prodProperties;

export { poolName, colors };
