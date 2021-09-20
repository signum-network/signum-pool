// Basic functions
import * as actionsType from "./actionTypes";
import axios from "../../axios/axios.instance";

// Blockchain functions
import {
  formatBaseTarget,
  formatTime,
  formatMinerName,
} from "../../functions/blockchain";

// Normal functions
import { thousands_separators } from "../../functions/normal";

// Extra
import { ENDPOINTToUse, maxSubMissionsKey } from "../../globalParameters";

// Fetch initial basic info
// If there is no data populated
// If skipvef is equal to true, it will ignore the conditions and still fetch the data and update it!
export const fetchBasicInfo =
  (data = null, skipvef = false.valueOf, t) =>
  async (dispatch) => {
    try {
      // Check if user really wants to fetch the data
      if (data.loadingData === true || skipvef === true) {
        // Fetch the basic data
        await axios
          .get("/api/getCurrentRound")
          .then((response) => {
            // Get the response
            const { data } = response;

            // Object to send to redux
            let responseData = {};

            // ASSIGN DATA

            // Block height
            responseData.blockHeight = data.miningInfo.height;

            // Round start
            responseData.roundStart = data.roundStart;

            // Base target
            responseData.baseTarget = data.miningInfo.baseTarget;

            // Difficulty
            responseData.averageCommitmentNQT =
              data.miningInfo.averageCommitmentNQT;

            // Network difficulty
            responseData.networkDifficulty =
              formatBaseTarget(data.miningInfo.baseTarget) +
              " + " +
              thousands_separators(
                Math.round(data.miningInfo.averageCommitmentNQT / 1e8).toFixed(
                  2
                )
              ) +
              " SIGNA/TiB";

            // Check if the pool has a miner with the best deadline
            if (data.bestDeadline && data.bestDeadline != null) {
              responseData.bestMiner =
                formatTime(data.bestDeadline.deadline) +
                " | " +
                formatMinerName(
                  data.bestDeadline.explorer,
                  data.bestDeadline.minerRS,
                  data.bestDeadline.miner,
                  data.bestDeadline.name,
                  false
                );
            } else {
              responseData.bestMiner = t("noFoundDeadline") + " ⚒️";
            }

            // Send the data to the redux reducer
            dispatch({
              type: actionsType.BASIC_INFO_FETCHED,
              payload: responseData,
            });
          })
          .catch((error) => {
            throw error;
          });
      } else {
        return false;
      }
    } catch (error) {
      dispatch({
        type: actionsType.BASIC_INFO_ERROR,
      });
    }
  };

// Fetch initial Signa price
export const fetchSignaPrice =
  (fetchNow = true) =>
  async (dispatch) => {
    try {
      // See if user wants to fetch the price
      if (fetchNow === false) {
        return false;
      }

      const response = await axios.get(ENDPOINTToUse);
      const { data } = response;

      dispatch({
        type: actionsType.SIGNA_PRICE_FETCHED,
        payload: thousands_separators(data.USD.toFixed(3)),
      });
    } catch (error) {
      dispatch({
        type: actionsType.SIGNA_PRICE_ERROR,
      });
    }
  };

// Fetch pool info
export const fetchPoolInfo =
  (fetchNow = true, t) =>
  async (dispatch) => {
    try {
      // See if user wants to fetch the price
      if (fetchNow === false) {
        return false;
      }

      // Fetch the pool data
      await axios
        .get("/api/getConfig")
        .then(async (response) => {
          // Get the response
          const { data } = response;

          // Object to send to redux
          let responseData = {};

          // Max submissions
          const maxSubmissions = thousands_separators(
            data.nAvg + data.processLag
          );

          // Save max submissions
          await localStorage.setItem(maxSubMissionsKey, ` / ${maxSubmissions}`);

          // Pool name
          responseData.poolName = data.poolName;

          // Number of blocks per average
          responseData.nAvg = thousands_separators(data.nAvg);

          // Number of Blocks to Show a Miner
          responseData.nMin = thousands_separators(data.nMin);

          // Max Deadline
          responseData.maxDeadline = thousands_separators(data.maxDeadline);

          // Grace Deadline
          responseData.graceDeadlines = data.graceDeadlines;

          // Process Lag
          responseData.processLag =
            thousands_separators(data.processLag) + ` ${t("blocks")}`;

          // Save pool fee value
          const poolFeeTemp =
            (parseFloat(data.poolFeePercentage) * 100).toFixed(2) + " %";

          // Pool Fee
          // If pool is giving a bonus, show it to miners!
          // If not, just show the normal fee percentage
          responseData.poolFee =
            data.poolFeePercentage &&
            data.poolFeePercentage < 0 &&
            data.poolFeePercentage < 1
              ? t("Bonus") + ", " + poolFeeTemp.replace("-", "")
              : poolFeeTemp;

          // Pool Solo Fee (miners sharing less than 20%)
          responseData.poolSoloFee =
            (parseFloat(data.poolSoloFeePercentage) * 100).toFixed(2) + " %";

          // Donation percentage (configurable)
          responseData.donationPercent =
            parseFloat(data.donationPercent).toFixed(2) + " %";

          // Default Pool Share (configurable)
          responseData.poolShare =
            (100 - parseFloat(data.winnerRewardPercentage) * 100).toFixed(2) +
            " %";

          // Default Minimum Payout (configurable)
          responseData.minimumPayout = data.defaultMinimumPayout + " SIGNA";

          // Minimum Payouts at once
          responseData.minPayoutsAtOnce = data.minPayoutsPerTransaction;

          // Payout Transaction Fee
          responseData.payoutTxFee = data.transactionFee + " SIGNA";

          // Pool Software Version
          responseData.poolVersion = data.version;

          // Send the data to the redux miner data reducer
          dispatch({
            type: actionsType.SUBMITTED_MAX_SUBMISSION,
            payload: maxSubmissions,
          });

          // Send the data to the redux pool config reducer
          dispatch({
            type: actionsType.POOL_INFO_FETCHED,
            payload: { ...data, ...responseData },
          });
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      dispatch({
        type: actionsType.POOL_INFO_ERROR,
      });
    }
  };

// Fetch won blocks data
export const fetchBlocksData =
  (fetchNow = true) =>
  async (dispatch) => {
    try {
      // See if user wants to fetch the price
      if (fetchNow === false) {
        return false;
      }

      // Fetch the block data data
      await axios
        .get("/api/getWonBlocks")
        .then((response) => {
          // Get the response
          const { data } = response;

          // Object to send to redux
          let responseData = {
            wonBlocks: data.wonBlocks,
            quantity: data.wonBlocks.length || 0,
          };

          // Send the data to the redux reducer
          dispatch({
            type: actionsType.BLOCK_DATA_FETCHED,
            payload: responseData,
          });
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      dispatch({
        type: actionsType.BLOCK_DATA_ERROR,
      });
    }
  };
