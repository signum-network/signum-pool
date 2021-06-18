// Basic functions
import * as actionsType from "./actionTypes";
import axios from "../../axios/axios.instance";

// Blockchain functions
import {
  formatCapacity,
  formatTime,
  formatMinerName,
} from "../../functions/blockchain";

// Normal functions
import { thousands_separators } from "../../functions/normal";

// Extra
import { userKeyBook, maxSubMissionsKey } from "../../globalParameters";

// Miner data template for easier dev
let foundMinerInitialData = {
  miner: "",
  currentDeadline: "",
  pendingBalance: "",
  physicalCapacity: "",
  effectiveCapacity: "",
  committedBalance: "",
  poCPlus: "",
  sharedCapacity: "",
  Software: "",
  data: {},
};

// Bookmarked Miner data template for easier dev
let bookmarkedMinerInitialData = [
  { title: "Miner address", value: "", type: "info" },
  {
    title: "Current Deadline",
    value: "",
    type: "info",
  },
  {
    title: "Confirmed Deadlines",
    value: "",
    type: "info",
  },
  { title: "Pending Balance", value: "", type: "info" },
  { title: "Committed Balance", value: "", type: "info" },
  { title: "PoC+ Boost", value: "", type: "info" },
  { title: "Confirmed Deadlines", value: "", type: "info" },
  {
    title: "Software",
    value: "",
    type: "info",
  },
  { label: "Delete bookmark", type: "action" },
];

// Fetch miners data [all miners, lenght of list of miners]
// If there is no data populated
// If skipvef is equal to true, it will ignore the conditions and still fetch the data and update it!
export const fetchMinersData =
  (data = null, skipvef = false) =>
  async (dispatch) => {
    try {
      // Check if user really wants to fetch the data
      if (data.loadingData === true || skipvef === true) {
        // Fetch the basic data
        await axios
          .get("/api/getMiners")
          .then(async (response) => {
            // Get the response
            const { data } = response;

            // Object to send to redux
            let responseData = {};

            // Miner count
            responseData.minerCount =
              thousands_separators(data.miners.length) || 0;

            // Pool capacity
            responseData.poolCapacity = formatCapacity(data.poolCapacity);

            // Miners
            let minersToSend = [];

            // Pool max submission
            const poolSubmission =
              (await localStorage.getItem(maxSubMissionsKey)) || "";

            let confirmedDeadlines = null;

            // Loop through miners
            data.miners.map((miner, key) => {
              // Miner confirmed deadlines
              confirmedDeadlines =
                poolSubmission &&
                poolSubmission !== null &&
                poolSubmission !== undefined &&
                poolSubmission !== "" &&
                miner.nConf &&
                miner.nConf !== null &&
                miner.nConf !== undefined &&
                miner.nConf !== ""
                  ? miner.nConf + poolSubmission
                  : "";

              // Merge miners data
              const minerTemplate = {
                // Name
                miner: formatMinerName(
                  response.explorer,
                  miner.addressRS,
                  miner.address,
                  miner.name,
                  false
                ),

                // Current deadline
                currentDeadline:
                  miner.currentRoundBestDeadline === null ||
                  miner.currentRoundBestDeadline === undefined ||
                  isNaN(miner.currentRoundBestDeadline)
                    ? "Waiting..."
                    : formatTime(miner.currentRoundBestDeadline),

                // Confirmed deadlines
                confirmedDeadline: confirmedDeadlines || "",

                // Pending balance
                pendingBalance: miner.pendingBalance,

                // Physical Capacity
                physicalCapacity: formatCapacity(miner.totalCapacity),

                // Effective capacity
                effectiveCapacity: formatCapacity(miner.totalEffectiveCapacity),

                // Commited balance
                committedBalance: thousands_separators(miner.committedBalance),

                poCPlus: thousands_separators(miner.boostPool.toFixed(3)),
                sharedCapacity: formatCapacity(miner.sharedCapacity),

                // Software (Miner / userAgent)
                Software:
                  miner.userAgent === null
                    ? "unknown, update your miner"
                    : miner.userAgent,

                // Pool share
                poolShare: (parseFloat(miner.share) * 100).toFixed(3) + "%",
              };

              // Add miner data to array
              minersToSend.push({
                ...minerTemplate,
                data: {
                  ...miner,
                  ...minerTemplate,
                  commitment: thousands_separators(miner.commitment),
                },
              });
            });

            // Send Miners payload
            responseData.miners = minersToSend || [];

            // Send top 10 miners
            responseData.topTen = minersToSend.slice(0, 9) || [];

            // Dispatch the bookmark function
            dispatch(selectBookmarkedMiner(responseData.miners));

            // Send the data to the redux reducer
            dispatch({
              type: actionsType.MINING_DATA_FETCHED,
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

// Look through every miner and select the bookmarked one
export const selectBookmarkedMiner =
  (data = null) =>
  async (dispatch) => {
    try {
      const userId = await localStorage.getItem(userKeyBook);

      // Check if there is a complete data
      // Also check if user has an existing miner bookmarked
      // Also check if the user really bookmarked a miner
      if (
        userId &&
        userId !== null &&
        userId !== undefined &&
        data &&
        data !== null &&
        data !== {}
      ) {
        return new Promise((resolve, reject) => {
          var foundUser = false;

          // Loop through array until it finds to bookmarked miner
          data.map(async (miner, index) => {
            // Get account id of every miner
            const id = miner.data.address;

            if (id === userId) {
              resolve(miner.data);
              foundUser = true;

              // Check if it is the last account and user has not still found any account
            } else if (
              index + 1 === data.length &&
              id !== userId &&
              foundUser === false
            ) {
              // If it did not find it, delete that localStorage
              await localStorage.removeItem(userKeyBook);

              reject("notFound");
            }
          });
        })
          .then(async (response) => {
            // Pool max submission
            const poolSubmission =
              (await localStorage.getItem(maxSubMissionsKey)) || "";

            // Confirmed deadlines
            const confirmedDeadlines =
              poolSubmission &&
              poolSubmission !== null &&
              poolSubmission !== undefined &&
              poolSubmission !== "" &&
              response.nConf &&
              response.nConf !== null &&
              response.nConf !== undefined &&
              response.nConf !== ""
                ? response.nConf + poolSubmission
                : "";

            // Object to send to redux
            const responseData = [
              // Username
              response.name && response.name.trim() !== ""
                ? { title: "Username", value: response.name, type: "info" }
                : null,

              // Address
              {
                title: "Miner address",
                value: response.addressRS,
                type: "info",
              },

              // Past deadlines
              {
                title: "Past deadlines",
                value: "BookmarkedMinerDeadlines",
                type: "BookmarkedMinerDeadlines",
              },

              // Current deadline
              {
                title: "Current Deadline",
                value: response.currentDeadline || "Waiting..",
                type: "info",
              },

              // Confirmed deadline
              {
                title: "Confirmed Deadlines",
                value: confirmedDeadlines || "",
                type: "info",
              },

              // Pending balance
              {
                title: "Pending Balance",
                value: response.pendingBalance,
                type: "info",
              },

              // Commited balance
              {
                title: "Committed Balance",
                value: response.committedBalance,
                type: "info",
              },

              // Donation %
              {
                title: "Donation Percent",
                value: response.donationPercent + "%",
                type: "info",
              },

              // PoC+ Boost
              { title: "PoC+ Boost", value: response.poCPlus, type: "info" },

              // Pool Share
              {
                title: "Pool Share",
                value: (parseFloat(response.share) * 100).toFixed(3) + "%",
                type: "info",
              },

              // Software user agent
              {
                title: "Software",
                value: response.Software,
                type: "info",
              },

              // Action
              { label: "Delete bookmark", type: "action" },
            ];

            // Save bookmarked miner data
            const minerData = responseData;

            // Get bookmarked miner deadlines and heights
            await axios
              .get("/api/getMiner/" + response.address)
              .then(async (response) => {
                // Get the response
                const { data } = response;

                // Save deadlines and heights
                let deadlines = data.deadlines;
                let heights = data.heights;
                let boost = data.boost;

                // Check if user has deadlines
                if (
                  // Deadline
                  !deadlines ||
                  deadlines === null ||
                  deadlines === undefined ||
                  deadlines === "" ||
                  deadlines === [] ||
                  deadlines.length === 0 ||
                  // Height
                  !heights ||
                  heights === null ||
                  heights === undefined ||
                  heights === "" ||
                  heights === [] ||
                  heights.length === 0 ||
                  // Boost
                  !boost ||
                  boost === null ||
                  boost === undefined ||
                  boost === "" ||
                  boost === [] ||
                  boost.length === 0
                ) {
                  throw "error";
                }

                // Send the data to the redux reducer
                dispatch({
                  type: actionsType.FOUND_BOOKMARKED_MINER,
                  payload: minerData,
                  deadlineData: { deadlines, heights, boost },
                });
              })
              .catch((error) => {
                // Send the data to the redux reducer
                dispatch({
                  type: actionsType.FOUND_BOOKMARKED_MINER,
                  payload: minerData,
                  deadlineData: null,
                });
              });
          })
          .catch((error) => {
            return dispatch({
              type: actionsType.NOT_FOUND_BOOKMARKED_MINER,
            });
          });
      } else {
        // Send the data to the redux reducer
        return dispatch({
          type: actionsType.NOT_FOUND_BOOKMARKED_MINER,
        });
      }
    } catch (error) {
      dispatch({
        type: actionsType.BASIC_INFO_ERROR,
      });
    }
  };
