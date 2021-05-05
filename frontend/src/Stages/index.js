import {
  Avatar,
  Badge,
  Chip,
  Divider,
  Grid,
  Hidden,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import _ from "lodash";
import { green, grey, red } from "@material-ui/core/colors";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import TimerIcon from "@material-ui/icons/Timer";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

export default function Stages({ stages }) {
  const values = _.values(stages);

  const getTrendingIcon = (trend) => {
    if (trend === 0) {
      return <TrendingFlatIcon style={{ color: green[300] }} />;
    } else if (trend > 0) {
      return <TrendingUpIcon style={{ color: green[500] }} />;
    } else {
      return <TrendingDownIcon style={{ color: red[500] }} />;
    }
  };

  return (
    <React.Fragment>
      {values.map((stage, index) => {
        return (
          <React.Fragment key={stage.id}>
            <ListItem>
              <ListItemAvatar>
                {stage.completed ? (
                  <Badge
                    overlap="rounded"
                    badgeContent={getTrendingIcon(stage.trend)}
                  >
                    <Avatar
                      variant="rounded"
                      style={{ backgroundColor: grey[900] }}
                    >
                      <Typography variant="overline" color="textSecondary">
                        {stage.rank}
                      </Typography>
                    </Avatar>
                  </Badge>
                ) : (
                  <Avatar>
                    <Typography variant="overline" color="textSecondary">
                      DNF
                    </Typography>
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography>
                    {index + 1}. {stage.name}
                  </Typography>
                }
                secondary={
                  stage.completed && (
                    <Grid container spacing={1}>
                      <Grid item>
                        <Chip
                          icon={<TimerIcon />}
                          size="small"
                          label={stage.stageTime}
                        />
                      </Grid>
                      <Grid item>
                        <Chip
                          size="small"
                          label={
                            stage.stageDiff === "--"
                              ? "Leader"
                              : stage.stageDiff
                          }
                        />
                      </Grid>
                      <Grid item>
                        <Hidden smUp>
                          <Chip
                            size="small"
                            icon={<AccessTimeIcon />}
                            label={stage.totalTime}
                          />
                        </Hidden>
                      </Grid>
                    </Grid>
                  )
                }
              />
              <ListItemSecondaryAction>
                {stage.completed && (
                  <Hidden xsDown>
                    <Chip icon={<AccessTimeIcon />} label={stage.totalTime} />
                  </Hidden>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            {index < values.length - 1 && <Divider />}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}
