// Basic functions
import * as actionsType from "./actionTypes";
import axios from "../../axios/axios.instance";

// Blockchain functions
import { formatCapacity, formatTime } from "../../functions/blockchain";

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
  (data = null, skipvef = false, t) =>
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

              // Check if miner has a username
              const minerData =
                miner.name &&
                miner.name !== null &&
                miner.name !== undefined &&
                miner.name !== ""
                  ? miner.name
                  : miner.addressRS;

              // Merge miners data
              const minerTemplate = {
                miner: minerData,
                currentDeadline:
                  miner.currentRoundBestDeadline === null ||
                  miner.currentRoundBestDeadline === undefined ||
                  isNaN(miner.currentRoundBestDeadline)
                    ? t("waiting")
                    : formatTime(miner.currentRoundBestDeadline),
                confirmedDeadline: confirmedDeadlines || "",
                pendingBalance: miner.pendingBalance,
                physicalCapacity: formatCapacity(miner.totalCapacity),
                effectiveCapacity: formatCapacity(miner.totalEffectiveCapacity),
                committedBalance: thousands_separators(miner.committedBalance),
                poCPlus: thousands_separators(miner.boostPool.toFixed(3)),
                sharedCapacity: formatCapacity(miner.sharedCapacity),
                Software:
                  miner.userAgent === null
                    ? t("updateYourMiner")
                    : miner.userAgent,
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
            responseData.topTen = minersToSend.slice(0, 10) || [];

            // Dispatch the bookmark function
            dispatch(selectBookmarkedMiner(responseData.miners, t));

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
  (data = null, t = null) =>
  async (dispatch) => {
    try {
      // Get possible account ID
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

            // Bookmarked Miners Data
            const responseData = [
              response.name && response.name.trim()
                ? { title: t("username"), value: response.name, type: "info" }
                : null,
              {
                title: t("minerAddress"),
                value: response.addressRS,
                type: "info",
              },
              {
                title: t("pendingBalance"),
                value: response.pendingBalance,
                type: "info",
              },
              {
                title: t("currentDeadline"),
                value: response.currentDeadline || t("waiting"),
                type: "info",
              },
              {
                title: t("pastDeadlines"),
                value: "BookmarkedMinerDeadlines",
                type: "BookmarkedMinerDeadlines",
              },
              {
                title: t("confirmedDeadline"),
                value: confirmedDeadlines || "",
                type: "info",
              },
              {
                title: t("effectiveCapacity"),
                value: response.effectiveCapacity,
                type: "info",
              },
              {
                title: t("physicalCapacity"),
                value: response.physicalCapacity,
                type: "info",
              },
              {
                title: t("poCPlus"),
                value: response.poCPlus,
                type: "info",
              },
              {
                title: t("committedBalance"),
                value: response.committedBalance,
                type: "info",
              },
              {
                title: t("donationPercentage"),
                value: response.donationPercent + "%",
                type: "info",
              },
              {
                title: t("poolShare"),
                value: (parseFloat(response.share) * 100).toFixed(3) + "%",
                type: "info",
              },
              {
                title: t("Software"),
                value: response.Software,
                type: "info",
              },
              {
                label: t("deleteBookmark"),
                type: "action",
              },
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
