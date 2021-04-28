import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    padding: 4,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

export default function ChallengesGridList({
  challenges,
  setChallenge,
  selectedChallenge,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {challenges.map((challenge) => (
          <GridListTile
            key={challenge.id}
            onClick={(e) => {
              setChallenge(challenge);
            }}
          >
            <img src={challenge.img} alt={challenge.groupName} />
            <GridListTileBar
              title={`${challenge.groupName}`}
              subtitle={`${challenge.vehicleName}`}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                challenge === selectedChallenge && (
                  <IconButton aria-label={`select ${challenge.groupName}`}>
                    <CheckIcon className={classes.title} />
                  </IconButton>
                )
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
