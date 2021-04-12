import React from 'react';
import {
  IconButton
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";


const buttonStyles = makeStyles(theme => ({
  appBarButton: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
      opacity: "0.5",
    },
    padding: '5px 7px',
    margin: '0 3px',
    transition: "opacity 0.2s",
    fontWeight: "300",
    textTransform: "none",
  }
}));

export default function HeaderButton(props) {
  const classes = buttonStyles();

  return (
    <>
      <IconButton
        color="inherit"
        className={classes.appBarButton}
        disableTouchRipple
        onClick={props.onClick}
        size='small'
        {...props}
      >
        {props.children}
      </IconButton>
    </>
  );
}