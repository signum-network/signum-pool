package burst.pool;

import signumj.service.NodeService;
import signumj.util.SignumUtils;
import burst.pool.miners.MinerMaths;
import burst.pool.miners.MinerTracker;
import burst.pool.pool.Pool;
import burst.pool.pool.Server;
import burst.pool.storage.config.PropertyService;
import burst.pool.storage.config.PropertyServiceImpl;
import burst.pool.storage.config.Props;
import burst.pool.storage.persistent.DbStorageService;
import burst.pool.storage.persistent.StorageService;
import fi.iki.elonen.NanoHTTPD;
import org.flywaydb.core.api.FlywayException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Properties;

public class Launcher {
    public static void main(String[] args) { // todo catch exception

        // New address prefixes
        SignumUtils.addAddressPrefix("S");
        SignumUtils.addAddressPrefix("TS");
        SignumUtils.addAddressPrefix("BURST");
        SignumUtils.setValueSuffix("SIGNA");

        if (System.getProperty("log4j.configurationFile") == null) {
            System.setProperty("log4j.configurationFile", "logging.xml");
        }
        Logger logger = LoggerFactory.getLogger(Launcher.class);

        String propertiesFileName = "pool.properties";
        if (args.length > 0) {
            propertiesFileName = args[0];
        }
        PropertyService propertyService = new PropertyServiceImpl(propertiesFileName);

        Properties versionProp = new Properties();
        try {
            versionProp.load(Launcher.class.getResourceAsStream("/version.properties"));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        String version = versionProp.getProperty("version", "develop");

        // Set the default prefix
        SignumUtils.setAddressPrefix(propertyService.getBoolean(Props.testnet) ? "TS" : "S");

        MinerMaths minerMaths = new MinerMaths(propertyService.getInt(Props.nAvg) + propertyService.getInt(Props.processLag),
                propertyService.getInt(Props.nMin), propertyService.getInt(Props.graceDeadlines));

        int nodeTimeout = propertyService.getInt(Props.nodeTimeout);
        String[] nodeAddresses =  propertyService.getStringList(Props.nodeAddresses);
        NodeService nodeService = NodeService.getUseBestInstance(true, Constants.USER_AGENT + version, nodeTimeout, nodeAddresses);
        StorageService storageService = null;
        try {
            storageService = new DbStorageService(propertyService, minerMaths, nodeService);
        } catch (SQLException | FlywayException e) {
            logger.error("Could not open database connection", e);
            System.exit(-1);
        }
        MinerTracker minerTracker = new MinerTracker(nodeService, propertyService);
        Pool pool = new Pool(nodeService, storageService, propertyService, minerTracker, version);
        Server server = new Server(storageService, propertyService, pool);
        try {
            server.start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        } catch (IOException e) {
            logger.error("Could not start server", e);
            System.exit(-1);
        }
    }
}
