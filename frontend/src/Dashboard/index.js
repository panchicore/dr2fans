import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PlayersAutocomplete from "../PlayersAutocomplete";
import Challenges from "../Challenges";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [player, setPlayer] = React.useState();

  const onPlayerSelect = (player) => {
    setPlayer(player);
  };

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PlayersAutocomplete onPlayerSelect={onPlayerSelect} />
        </Grid>

        <Grid item xs={12}>
          {player && <Challenges player={player} />}
        </Grid>
      </Grid>
    </Container>
  );
}
