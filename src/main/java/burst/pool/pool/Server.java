package burst.pool.pool;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigInteger;
import java.net.SocketException;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

import org.ehcache.Cache;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;

import burst.kit.crypto.BurstCrypto;
import burst.kit.entity.BurstAddress;
import burst.kit.entity.BurstValue;
import burst.kit.entity.response.MiningInfo;
import burst.kit.util.BurstKitUtils;
import burst.pool.Constants;
import burst.pool.miners.Deadline;
import burst.pool.miners.Miner;
import burst.pool.storage.config.PropertyService;
import burst.pool.storage.config.Props;
import burst.pool.storage.persistent.StorageService;
import fi.iki.elonen.NanoHTTPD;

public class Server extends NanoHTTPD {
    private static final Logger logger = LoggerFactory.getLogger(Server.class);

    private static final HashMap<String, String> mimeTypesAllowed = new HashMap<>();
    static {
        mimeTypesAllowed.put("ico", "image/x-icon");
        mimeTypesAllowed.put("png", "image/png");
        mimeTypesAllowed.put("html", MIME_HTML);
        mimeTypesAllowed.put("css", "text/css");
        mimeTypesAllowed.put("svg", "image/svg+xml");
        mimeTypesAllowed.put("js", "text/javascript");
        mimeTypesAllowed.put("json", "application/json");
        mimeTypesAllowed.put("map", "application/json");
        mimeTypesAllowed.put("txt", "text/plain");
    }

    private final StorageService storageService;
    private final PropertyService propertyService;
    private final Pool pool;
    private final Gson gson = BurstKitUtils.buildGson().create();
    private final BurstCrypto burstCrypto = BurstCrypto.getInstance();
    private final Cache<String, String> fileCache;
    
    private final File htmlRoot;

    private String apiAllowOrign;
    
    public Server(StorageService storageService, PropertyService propertyService, Pool pool) {
        super(propertyService.getInt(Props.serverPort));
        this.storageService = storageService;
        this.propertyService = propertyService;
        this.pool = pool;
        this.fileCache = propertyService.getBoolean(Props.siteDisableCache) ? null :
            CacheManagerBuilder.newCacheManagerBuilder()
                .withCache("file", CacheConfigurationBuilder.newCacheConfigurationBuilder(String.class, String.class, ResourcePoolsBuilder.heap(1024*1024)))
                .build(true)
                .getCache("file", String.class, String.class);
        this.apiAllowOrign = propertyService.getString(Props.apiAllowOrign);
        
        this.htmlRoot = new File(propertyService.getString(Props.siteRoot));
    }

    private long getCurrentHeight() {
        MiningInfo miningInfo = pool.getMiningInfo();
        if (miningInfo == null) return 0;
        return miningInfo.getHeight();
    }

    @Override
    public Response serve(IHTTPSession session) {
        try {
            Map<String, String> params = queryToMap(session.getQueryParameterString());
            session.parseBody(new HashMap<>());
            params.putAll(session.getParms());
            if (session.getUri().startsWith("/burst")) {
                return NanoHTTPD.newFixedLengthResponse(Response.Status.OK, "application/json", handleBurstApiCall(session, params));
            } else if (session.getUri().startsWith("/api")) {
                Response resp = NanoHTTPD.newFixedLengthResponse(Response.Status.OK, "application/json", handleApiCall(session, params));
                if(apiAllowOrign.length() > 0) {
                    // CORS handling
                    resp.addHeader("Access-Control-Allow-Origin", apiAllowOrign);
                    resp.addHeader("Access-Control-Max-Age", "3628800");
                    resp.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
                    resp.addHeader("Access-Control-Allow-Headers", "X-Requested-With");
                    resp.addHeader("Access-Control-Allow-Headers", "Authorization");
                }
                
                return resp;
            } else {
                return handleCall(session, params);
            }
        } catch (SocketException e) {
            logger.warn("SocketException for {}", session.getRemoteIpAddress());
            return NanoHTTPD.newFixedLengthResponse(e.getMessage());
        } catch (Exception e) {
            logger.warn("Error getting response", e);
            return NanoHTTPD.newFixedLengthResponse(e.getMessage());
        }
    }

    private String handleBurstApiCall(IHTTPSession session, Map<String, String> params) {
        if (session.getMethod().equals(Method.POST) && Objects.equals(params.get("requestType"), "submitNonce")) {
            BigInteger nonce = null;
            try {
                nonce = new BigInteger(params.get("nonce"));
            } catch (Exception ignored) {}
            Submission submission = new Submission(BurstAddress.fromEither(params.get("accountId")), nonce);
            try {
                if (submission.getMiner() == null) {
                    throw new SubmissionException("Account ID not set");
                }
                if (submission.getNonce() == null) {
                    throw new SubmissionException("Nonce not set or invalid");
                }
                
                String userAgent = session.getHeaders().get("user-agent");
                if (userAgent == null) userAgent = "";
                return gson.toJson(new NonceSubmissionResponse("success", pool.checkNewSubmission(submission, userAgent)));
            } catch (SubmissionException e) {
                return gson.toJson(new NonceSubmissionResponse(e.getMessage(), null));
            }
        } else if (Objects.equals(params.get("requestType"), "getMiningInfo")) {
            MiningInfo miningInfo = pool.getMiningInfo();
            if (miningInfo == null) return gson.toJson(JsonNull.INSTANCE);
            JsonObject miningInfoObj = new JsonObject();
            miningInfoObj.addProperty("height", Long.toUnsignedString(miningInfo.getHeight()));
            miningInfoObj.addProperty("generationSignature", burstCrypto.toHexString(miningInfo.getGenerationSignature()));
            miningInfoObj.addProperty("baseTarget", Long.toUnsignedString(miningInfo.getBaseTarget()));
            miningInfoObj.addProperty("averageCommitmentNQT", Long.toUnsignedString(miningInfo.getAverageCommitmentNQT()));
            
            return miningInfoObj.toString();
            // return gson.toJson(new MiningInfoResponse(burstCrypto.toHexString(miningInfo.getGenerationSignature()), miningInfo.getBaseTarget(), miningInfo.getHeight(), miningInfo.getAverageCommitmentNQT()));
        } else {
            return "404 not found";
        }
    }

    private String handleApiCall(IHTTPSession session, Map<String, String> params) {
        
        if (session.getUri().startsWith("/api/getMiners")) {
            JsonArray minersJson = new JsonArray();
            AtomicReference<Double> poolCapacity = new AtomicReference<>(0d);
            storageService.getMinersFiltered()
                    .stream()
                    .sorted(Comparator.comparing(Miner::getSharedCapacity).reversed())
                    .forEach(miner -> {
                        poolCapacity.updateAndGet(v -> v + miner.getTotalCapacity());
                        minersJson.add(minerToJson(miner, false));
                    });
            JsonObject jsonObject = new JsonObject();
            jsonObject.add("miners", minersJson);
            jsonObject.addProperty("explorer", propertyService.getString(Props.siteExplorerURL) + propertyService.getString(Props.siteExplorerAccount));
            jsonObject.addProperty("poolCapacity", poolCapacity.get());
            return jsonObject.toString();
        } else if (session.getUri().startsWith("/api/getMiner/")) {
            BurstAddress minerAddress = BurstAddress.fromEither(session.getUri().substring(14));
            return minerToJson(storageService.getMiner(minerAddress), true).toString();
        } else if (session.getUri().startsWith("/api/getConfig")) {
            JsonObject response = new JsonObject();
            response.addProperty("version", Constants.VERSION);
            response.addProperty("explorer", propertyService.getString(Props.siteExplorerURL) + propertyService.getString(Props.siteExplorerAccount));
            response.addProperty(Props.poolName.getName(), propertyService.getString(Props.poolName));
            response.addProperty("poolAccount", pool.getAccount().getID());
            response.addProperty("poolAccountRS", pool.getAccount().getFullAddress());
            response.addProperty(Props.nAvg.getName(), propertyService.getInt(Props.nAvg));
            response.addProperty(Props.nMin.getName(), propertyService.getInt(Props.nMin));
            response.addProperty(Props.maxDeadline.getName(), propertyService.getLong(Props.maxDeadline));
            response.addProperty(Props.processLag.getName(), propertyService.getInt(Props.processLag));
            response.addProperty(Props.feeRecipient.getName(), propertyService.getBurstAddress(Props.feeRecipient).getID());
            response.addProperty(Props.feeRecipient.getName() + "RS", propertyService.getBurstAddress(Props.feeRecipient).getFullAddress());
            response.addProperty(Props.poolFeePercentage.getName(), propertyService.getFloat(Props.poolFeePercentage));
            response.addProperty(Props.poolSoloFeePercentage.getName(), propertyService.getFloat(Props.poolSoloFeePercentage));
            response.addProperty(Props.donationRecipient.getName(), propertyService.getBurstAddress(Props.donationRecipient).getID());
            response.addProperty(Props.donationRecipient.getName() + "RS", propertyService.getBurstAddress(Props.donationRecipient).getFullAddress());
            response.addProperty(Props.donationPercent.getName(), propertyService.getInt(Props.donationPercent));
            response.addProperty(Props.winnerRewardPercentage.getName(), propertyService.getFloat(Props.winnerRewardPercentage));
            response.addProperty(Props.defaultMinimumPayout.getName(), propertyService.getFloat(Props.defaultMinimumPayout));
            response.addProperty(Props.minimumMinimumPayout.getName(), propertyService.getFloat(Props.minimumMinimumPayout));
            response.addProperty(Props.minPayoutsPerTransaction.getName(), propertyService.getInt(Props.minPayoutsPerTransaction));
            response.addProperty("transactionFee", pool.getTransactionFee().toUnformattedString());
            
            response.addProperty("publicNode", propertyService.getString(Props.siteNodeAddress));
            response.addProperty("discordLink", propertyService.getString(Props.siteDiscordLink));
            response.addProperty("faucet", propertyService.getString(Props.siteFaucetURL));

            return response.toString();
        } else if (session.getUri().startsWith("/api/getCurrentRound")) {
            return pool.getCurrentRoundInfo(gson).toString();
        } else if (session.getUri().startsWith("/api/getTop10Miners")) {
            AtomicReference<Double> othersShare = new AtomicReference<>(1d);
            JsonArray topMiners = new JsonArray();
            storageService.getMinersFiltered().stream()
                    .sorted((m1, m2) -> Double.compare(m2.getShare(), m1.getShare())) // Reverse order - highest to lowest
                    .limit(10)
                    .forEach(miner -> {
                        topMiners.add(minerToJson(miner, false));
                        othersShare.updateAndGet(share -> share - miner.getShare());
                    });
            JsonObject response = new JsonObject();
            response.add("topMiners", topMiners);
            response.addProperty("explorer", propertyService.getString(Props.siteExplorerURL) + propertyService.getString(Props.siteExplorerAccount));
            response.addProperty("othersShare", othersShare.get());
            return response.toString();
        } else if (session.getUri().startsWith("/api/getWonBlocks")) {
            JsonArray wonBlocks = new JsonArray();
            storageService.getWonBlocks(100)
                    .forEach(wonBlock -> {
                        
                        JsonObject wonBlockJson = new JsonObject();
                        wonBlockJson.addProperty("height", wonBlock.getBlockHeight());
                        wonBlockJson.addProperty("id", wonBlock.getBlockId().getID());
                        wonBlockJson.addProperty("generator", wonBlock.getGeneratorId().getID());
                        wonBlockJson.addProperty("generatorRS", wonBlock.getGeneratorId().getFullAddress());
                        Miner miner = storageService.getMiner(wonBlock.getGeneratorId());
                        if (miner!= null && !Objects.equals(miner.getName(), "")) {
                            wonBlockJson.addProperty("name", miner.getName());
                        }
                        wonBlockJson.addProperty("reward", wonBlock.getFullReward().toFormattedString());
                        wonBlockJson.addProperty("poolShare", wonBlock.getPoolShare().toFormattedString());
                        wonBlocks.add(wonBlockJson);
                    });
            JsonObject response = new JsonObject();
            response.add("wonBlocks", wonBlocks);
            response.addProperty("explorer", propertyService.getString(Props.siteExplorerURL) + propertyService.getString(Props.siteExplorerAccount));

            return response.toString();
        } else {
            return "null";
        }
    }

    private Response handleCall(IHTTPSession session, Map<String, String> params) throws IOException {
        String uri = session.getUri();
        if (Objects.equals(uri, "") || Objects.equals(uri, "/")) {
            uri = "/index.html";
        }
        String mimeType = null;
        boolean isPath = false;
        
        if(!uri.contains(".")) {
            isPath = true;
            mimeType = MIME_HTML;
        }
        else {        
            for (String extension : mimeTypesAllowed.keySet()) {
                if (uri.endsWith(extension)) {
                    mimeType = mimeTypesAllowed.get(extension);
                    break;
                }
            }
        }
        
        if (mimeType == null || uri.contains("../")) {
            return NanoHTTPD.newFixedLengthResponse(Response.Status.FORBIDDEN, "text/html", "<h1>Access Forbidden</h1>");
        }

        if (fileCache != null && fileCache.containsKey(uri)) {
            return NanoHTTPD.newFixedLengthResponse(Response.Status.OK, URLConnection.guessContentTypeFromName(uri), fileCache.get(uri));
        }

        InputStream inputStream = null;
        if (uri.contains("favicon.ico")) {
            inputStream = new FileInputStream(propertyService.getString(Props.siteIconIco));
        } else if (uri.equals("/img/poolIcon.png")) {
            inputStream = new FileInputStream(propertyService.getString(Props.siteIconPng));
        } else {
            File file = new File(htmlRoot, uri);
            if(isPath || !file.isFile() || !file.exists() || !file.canRead()) {
                file = new File(htmlRoot, "index.html");
                mimeType = MIME_HTML;
            }
            inputStream = new FileInputStream(file);
        }

        if (uri.contains(".png") || uri.contains(".ico")) {
            return NanoHTTPD.newChunkedResponse(Response.Status.OK, uri.contains(".ico") ? "image/x-icon" : "image/png", inputStream);
        }
        
        int bufferSize = 1024*1024;
        char[] buffer = new char[bufferSize];
        StringBuilder out = new StringBuilder();
        Reader in = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
        for (int numRead; (numRead = in.read(buffer, 0, buffer.length)) > 0; ) {
            out.append(buffer, 0, numRead);
        }
        in.close();
        String response = out.toString();
        
        if (mimeType!=null && mimeType.equals(MIME_HTML)) {
            response = response
                    // Replace the TAGS
                    .replace("{TITLE}", propertyService.getString(Props.siteTitle))
                    .replace("{PRICEENDPOINT}", propertyService.getString(Props.sitePrice))
                    .replace("{PUBLICNODE}", propertyService.getString(Props.siteNodeAddress))
                    .replace("{DISCORD}", propertyService.getString(Props.siteDiscordLink))
                    .replace("{INFO}", propertyService.getString(Props.siteInfo))
                    .replace("{POOL_ACCOUNT}", burstCrypto.getBurstAddressFromPassphrase(propertyService.getString(Props.passphrase)).getFullAddress())
                    .replace("{MININGADDRESS}", propertyService.getString(Props.miningURL))
                    .replace("{MININGGUIDE}", propertyService.getString(Props.miningGuide))
                    .replace("{LAG}", Integer.toString(propertyService.getInt(Props.processLag)))
                    .replace("{MIN_PAYOUT}", BurstValue.fromBurst(propertyService.getFloat(Props.minimumMinimumPayout)).toUnformattedString())
                    .replace("{FAUCET}", propertyService.getString(Props.siteFaucetURL))
                    .replace("{EXPLORER}", propertyService.getString(Props.siteExplorerURL))
                    
                    .replace("\"*{PRIMARYCOLOR}*\"", propertyService.getString(Props.sitePrimaryColor))
                    .replace("\"*{PRIMARYLIGHTCOLOR}*\"", propertyService.getString(Props.sitePrimaryLightColor))
                    .replace("\"*{PRIMARYDARKCOLOR}*\"", propertyService.getString(Props.sitePrimaryDarkColor))
                    .replace("\"*{SECONDARYCOLOR}*\"", propertyService.getString(Props.siteSecondaryColor))
                    .replace("\"*{SECONDARYLIGHTCOLOR}*\"", propertyService.getString(Props.siteSecondaryLightColor))
                    .replace("\"*{SECONDARYDARKCOLOR}*\"", propertyService.getString(Props.siteSecondaryDarkColor))
                    .replace("\"*{GRAPHCOLOR}*\"", propertyService.getString(Props.siteGraphColor))
                    .replace("{PRIMARYCOLOR}", propertyService.getString(Props.sitePrimaryColor))
                    .replace("{PRIMARYLIGHTCOLOR}", propertyService.getString(Props.sitePrimaryLightColor))
                    .replace("{PRIMARYDARKCOLOR}", propertyService.getString(Props.sitePrimaryDarkColor))
                    .replace("{SECONDARYCOLOR}", propertyService.getString(Props.siteSecondaryColor))
                    .replace("{SECONDARYLIGHTCOLOR}", propertyService.getString(Props.siteSecondaryLightColor))
                    .replace("{SECONDARYDARKCOLOR}", propertyService.getString(Props.siteSecondaryDarkColor))
                    .replace("{GRAPHCOLOR}", propertyService.getString(Props.siteGraphColor))
                    
                    .replace("{SEODESCRIPTION}", propertyService.getString(Props.siteSeoDescription))
                    .replace("{SEOIMGURL}", propertyService.getString(Props.siteSeoImageUrl))
                    
                    .replace("{SHOWTRADINGLINK}", propertyService.getString(Props.siteShowTradingLink))
                    .replace("{MINITRADINGLINK}", propertyService.getString(Props.siteMiniTradingLink))
                    .replace("{LARGETRADINGLINK}", propertyService.getString(Props.siteLargeTradingLink))
                    
                    ;
        }
        if(fileCache != null) {
            fileCache.put(uri, response);
        }
        return NanoHTTPD.newFixedLengthResponse(Response.Status.OK, mimeType, response);
    }

    private JsonElement minerToJson(Miner miner, boolean returnDeadlines) {
        if (miner == null) return JsonNull.INSTANCE;
        
        JsonObject minerJson = new JsonObject();
        minerJson.addProperty("address", miner.getAddress().getID());
        minerJson.addProperty("addressRS", miner.getAddress().getFullAddress());
        minerJson.addProperty("pendingBalance", miner.getPending().toFormattedString());
        minerJson.addProperty("totalCapacity", miner.getTotalCapacity());
        minerJson.addProperty("totalEffectiveCapacity", miner.getTotalEffectiveCapacity());
        minerJson.addProperty("commitment", miner.getCommittedBalance().divide(miner.getTotalEffectiveCapacity()).toFormattedString());
        minerJson.addProperty("committedBalance", miner.getCommittedBalance().toFormattedString());
        minerJson.addProperty("boost", miner.getBoost());
        minerJson.addProperty("boostPool", miner.getBoostPool());
        minerJson.addProperty("sharedCapacity", miner.getSharedCapacity());
        minerJson.addProperty("sharePercent", miner.getSharePercent());
        minerJson.addProperty("donationPercent", miner.getDonationPercent());
        minerJson.addProperty("nConf", miner.getNConf());
        minerJson.addProperty("share", miner.getShare());
        minerJson.addProperty("minimumPayout", miner.getMinimumPayout().toFormattedString());
        Deadline bestDeadline = miner.getBestDeadline(getCurrentHeight());
        if (bestDeadline != null) {
        	BigInteger deadline = bestDeadline.getDeadline();
       		deadline = BigInteger.valueOf((long)(Math.log(deadline.doubleValue()/bestDeadline.getBoost()) * Pool.LN_FACTOR));

            minerJson.addProperty("currentRoundBestDeadline", deadline.toString());
        }
        if (!Objects.equals(miner.getName(), "")) {
            minerJson.addProperty("name", miner.getName());
        }
        if (!Objects.equals(miner.getUserAgent(), "")) {
            minerJson.addProperty("userAgent", miner.getUserAgent());
        }
        
        if(returnDeadlines) {
            List<Deadline> deadlines = miner.getDeadlines();
            JsonArray deadlinesJson = new JsonArray();
            JsonArray baseTargetJson = new JsonArray();
            JsonArray heightsJson = new JsonArray();
            JsonArray sharesJson = new JsonArray();
            JsonArray boostJson = new JsonArray();
            JsonArray boostPoolJson = new JsonArray();
            for(Deadline d : deadlines) {
                deadlinesJson.add(d.getDeadline().longValue());
                baseTargetJson.add(d.getBaseTarget().longValue());
                heightsJson.add(d.getHeight());
                sharesJson.add(d.getSharePercent());
                boostJson.add(d.getBoost());
                boostPoolJson.add(d.getBoostPool());
            }
            minerJson.add("deadlines", deadlinesJson);
            minerJson.add("heights", heightsJson);
            minerJson.add("shares", sharesJson);
            minerJson.add("boost", boostJson);
            minerJson.add("boostPool", boostPoolJson);
        }
        
        return minerJson;
    }

    private static Map<String, String> queryToMap(String query) {
        Map<String, String> result = new HashMap<>();
        if (query == null) return result;
        for (String param : query.split("&")) {
            String[] entry = param.split("=");
            if (entry.length > 1) {
                result.put(entry[0], entry[1]);
            } else {
                result.put(entry[0], "");
            }
        }
        return result;
    }
}
