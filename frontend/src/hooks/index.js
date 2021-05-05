import axios from "axios";
import { useQuery } from "react-query";
import _ from "lodash";

function useChallenges() {
  return useQuery(
    "challenges",
    () => {
      return axios
        .get("https://dr2fans.web.app/jsondb/challenges_db.json")
        .then((res) => res.data);
    },
    {
      staleTime: 60 * 1000,
    }
  );
}

function usePlayerList() {
  return useQuery(
    "players",
    () => {
      return axios
        .get("https://dr2fans.web.app/jsondb/players_db.json")
        .then((res) => res.data);
    },
    {
      staleTime: 60 * 1000,
    }
  );
}

function usePlayerChallenges(challenges, player) {
  return useQuery(
    `players-${player.p}`,
    () => {
      return axios
        .get(
          `https://dr2fans.web.app/jsondb/players_data/players-${player.p}.json`
        )
        .then((res) => {
          const races = res.data[player.u];

          const userChallengeEntries = _.groupBy(races.entries, "challenge_id");

          let userResults = [];

          // hydrate the user challenges based on the master challenges,
          // make the structure so we can render friendly
          _.forEach(challenges.data, (challenge, challengeId) => {
            if (!_.keys(userChallengeEntries).includes(challengeId)) {
              // player didn't play this challenge, skip it.
              return;
            }

            // group user events by the current challenge
            const userEventEntries = _.groupBy(
              userChallengeEntries[challengeId],
              "event_id"
            );

            // rank is the last event, last stage rank.
            const lastEvent = _.last(_.values(userEventEntries));
            const lastStage = _.last(_.values(lastEvent));
            challenge.rank = lastStage.rank;
            challenge.img =
              "https://hardzone.es/app/uploads-hardzone.es/2019/01/DiRT-Rally-2.0-01.jpg";
            challenge.charts = [];

            // hydrate the challenge events with user player events
            let lastEventRank = Number.MAX_SAFE_INTEGER;
            _.forEach(challenge.events, (event, eventId) => {
              const completed = _.keys(userEventEntries).includes(eventId);
              challenge.events[eventId].completed = completed;
              challenge.events[eventId].trend = 0;

              const userStagesEntries = userEventEntries[eventId];

              if (completed) {
                // event rank is the rank of the last stage
                const lastStage = _.last(_.values(userStagesEntries));
                challenge.events[eventId].rank = lastStage.rank;
                challenge.events[eventId].totalTime = lastStage.totalTime;
                challenge.events[eventId].totalDiff = lastStage.totalDiff;

                // calculate the trending
                challenge.events[eventId].trend =
                  lastStage.rank < lastEventRank ? 1 : -1;
                lastEventRank = lastStage.rank;
              }

              // hydrate the challenge event stages with user player event stages

              let lastStageRank = Number.MAX_SAFE_INTEGER;
              _.forEach(event.stages, (stage, stageId) => {
                const completed = _.keys(userStagesEntries).includes(stageId);
                challenge.events[eventId].stages[stageId].completed = completed;
                challenge.events[eventId].stages[stageId].trend = 0;
                if (completed) {
                  // calculate the trending
                  let trend = 0;
                  if (userStagesEntries[stageId].rank < lastStageRank) {
                    trend = 1;
                  } else if (userStagesEntries[stageId].rank > lastStageRank) {
                    trend = -1;
                  }
                  challenge.events[eventId].stages[stageId].trend = trend;
                  lastStageRank = userStagesEntries[stageId].rank;

                  // hydrate to display
                  challenge.events[eventId].stages[stageId] = {
                    ...challenge.events[eventId].stages[stageId],
                    ...userStagesEntries[stageId],
                  };
                  // the vehicle is the same for all the events
                  challenge.vehicleName =
                    challenge.events[eventId].stages[stageId].vehicleName;

                  challenge.charts = [
                    ...challenge.charts,
                    {
                      x: challenge.events[eventId].stages[stageId].name,
                      y: userStagesEntries[stageId].rank,
                    },
                  ];
                }
              });
            });

            userResults = [challenge, ...userResults];
          });
          return userResults;
        });
    },
    {
      staleTime: 60 * 1000,
    }
  );
}

export { useChallenges, usePlayerList, usePlayerChallenges };
