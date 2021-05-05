import React from "react";
import Grid from "@material-ui/core/Grid";
import {AppContext} from "../contexts";
import {usePlayerChallenges} from "../hooks";
import Events from "../Events";
import ChallengesGridList from "./ChallengesGridList";
import ChallengeStepLineChart from "./ChallengeStepLineChart";
import {Chip, LinearProgress, Paper} from "@material-ui/core";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import SettingsIcon from "@material-ui/icons/Settings";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

export default function Challenges({ player }) {
  const { challenges } = React.useContext(AppContext);
  const playerChallenges = usePlayerChallenges(challenges, player);
  const [challenge, setChallenge] = React.useState();

  if (playerChallenges.isLoading) {
    return <LinearProgress />;
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper>
          <ChallengesGridList
            challenges={playerChallenges.data}
            setChallenge={setChallenge}
            selectedChallenge={challenge}
          />
        </Paper>
      </Grid>

      {challenge && (
        <React.Fragment>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item>
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={challenge.groupName}
                />
              </Grid>
              <Grid item>
                <Chip
                  icon={<FormatListNumberedIcon />}
                  label={challenge.rank}
                />
              </Grid>
              <Grid item>
                <Chip icon={<SettingsIcon />} label={challenge.vehicleClass} />
              </Grid>
              <Grid item>
                <Chip icon={<DriveEtaIcon />} label={challenge.vehicleName} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <ChallengeStepLineChart challenge={challenge} />
          </Grid>

          <Events events={challenge.events} />
        </React.Fragment>
      )}
    </Grid>
  );
}
