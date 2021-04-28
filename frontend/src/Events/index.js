import {Box, Card, CardMedia, Chip, Grid, List, makeStyles, Typography,} from "@material-ui/core";
import React from "react";
import _ from "lodash";
import Stages from "../Stages";
import TimerIcon from "@material-ui/icons/Timer";
import AddAlarmIcon from "@material-ui/icons/AddAlarm";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
    color: theme.palette.primary.light,
  },
  pos: {
    marginBottom: 12,
  },
  media: {
    height: 140,
    display: "flex",
    alignItems: "center",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

export default function Events({ events }) {
  const values = _.values(events);
  const classes = useStyles();

  return (
    <React.Fragment>
      {values.map((event, index) => {
        return (
          <Grid item xs={12} key={event.id}>
            <Card className={classes.root}>
              <CardMedia
                className={classes.media}
                // image="TODO"
                title={event.name}
              >
                <Grid
                  container
                  direction="row"
                  justify="space-evenly"
                  alignItems="stretch"
                >
                  <Grid item xs={3}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Box
                        borderRadius="50%"
                        bgcolor={
                          event.completed ? "success.main" : "error.main"
                        }
                        m={1}
                        boxShadow={5}
                        style={{
                          width: "4rem",
                          height: "4rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h5">
                          {event.completed ? event.rank : "DNF"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={9}>
                    <Typography
                      variant="h4"
                      align="left"
                      fontWeight="fontWeightBold"
                    >
                      {index + 1}. {event.name}
                    </Typography>
                    {event.completed && (
                      <Box display="flex">
                        <Chip
                          icon={<TimerIcon />}
                          label={event.totalTime}
                          style={{ marginRight: 8 }}
                        />
                        <Chip
                          icon={<AddAlarmIcon />}
                          label={
                            event.totalDiff === "--"
                              ? "Leader"
                              : event.totalDiff
                          }
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardMedia>

              <List>
                <Stages stages={event.stages} />
              </List>
            </Card>
          </Grid>
        );
      })}
    </React.Fragment>
  );
}
