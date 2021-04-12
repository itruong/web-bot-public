import React from 'react';
import { withRouter } from 'react-router';
import {
  Link
} from 'react-router-dom';
import {
  AppBar,
  Box,
  Grid,
  Toolbar,
} from '@material-ui/core';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from "prop-types";
import HeaderButton from '../HeaderButton/HeaderButton';


const appBarStyles = theme => ({
  appBar: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    color: 'black',
    boxShadow: 'none',
    borderBottom: '1px solid #d3d3d38a',
    outline: 'none',
    height: '52px'
  },
  toolbar: {
    minHeight: 'auto'
  },
  toolbarOffset: {
    visibility: 'hidden'
  }
});

class HeaderBar extends React.Component {

  renderAppBar = () => {
    const { classes } = this.props;
    return (
      <AppBar id="appBar" className={classes.appBar}>
        {this.renderHeaderBar()}
      </AppBar>
    );
  }

  renderHeaderBar = () => {
    return (
      <>
        <HeaderBarWide/>
      </>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {this.renderAppBar()}
        <div className={classes.toolbarOffset}>
          {this.renderHeaderBar()}
        </div>
      </div>
    )
  }
}

HeaderBar = withStyles(appBarStyles)(HeaderBar)
HeaderBar = withRouter(HeaderBar)

class HeaderBarWide extends React.Component {
  handleKeyPress = (event) => {
    if (event.keyCode === 13) {
      this.props.onSearch();
    }
  }

  renderHeaderButtons = () => {
    return (
      <Box display='flex' justifyContent='flex-end'>
        <HeaderButtonGroup
          path={this.props.path}
        />
      </Box>
    );
  }

  renderLogo = () => {
    return (
      <Link
        className='hidden-link'
        to='/'
      >
        <span className='logo-text'>
          autobot
        </span>
      </Link>
    )
  }

  render() {
    const { classes } = this.props;
    return (
      <Toolbar className={classes.toolbar}>
        <Box mt={1} mb={1} width={1}>
          <Grid container spacing={1} alignItems='center'>
            <Grid item xs={12} container spacing={2} alignItems='center'>
              <Grid item>
                {this.renderLogo()}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Toolbar>
    );
  }
}

HeaderBarWide.propTypes = {
  classes: PropTypes.object.isRequired,
};

HeaderBarWide = withStyles(appBarStyles)(HeaderBarWide);

function HeaderButtonGroup (props) {
  return (
    <>
      <HeaderButton
        component={Link}
        to='/'
      >
        <HomeOutlinedIcon/>
      </HeaderButton>
    </>
  )
}

export default HeaderBar;
