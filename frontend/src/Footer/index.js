import React from "react";
import GitHubIcon from "@material-ui/icons/GitHub";
import { Box, IconButton } from "@material-ui/core";

export default function Footer() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <IconButton
        color="primary"
        onClick={() =>
          window.location.assign("https://github.com/panchicore/dr2fans")
        }
      >
        <GitHubIcon />
      </IconButton>
    </Box>
  );
}
