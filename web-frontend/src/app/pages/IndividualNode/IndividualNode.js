import React from 'react';
import { withRouter } from 'react-router';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  withStyles
} from '@material-ui/core/styles';
import Page from '../../components/Page/Page';
import config from '../../../config/config';
import Guacamole from '../../../guacamole-common-js-2';


const DISPLAY_WIDTH_PERCENT = 75;
const APPBAR_OFFSET = 50;
const DISPLAY_MARGIN = 10;


const styles = theme => ({
  container: {
    padding: theme.spacing(3)
  },
  display: {
    margin: '10px'
    // backgroundColor: 'black'
  },
  displayContainer: {
    padding: '4px'
  },
  displayStatus: {
    padding: theme.spacing(2),
    border: '1px solid lightgray',
    boxShadow: 'none'
  },
  sideBar: {
    padding: '4px'
    // margin: theme.spacing(3)
  }
})

export default class IndividualNode extends React.Component {
  state = {
    isLoading: true,
    displayWidth: 0
  }
  componentDidMount() {
    // this.get_active_nodes().then(nodes => {
    //   this.setState({ nodes });
    // });
    // Connect
    this.setUpGuac();
  }

  componentWillUnmount() {
    this.guac.disconnect();
    window.onunload = null
    window.onresize = null;
  }
  
  // getNodeStatus = async () => {
  //   const res = await fetch(
  //     `${config.SERVER_BASE_URL}/node`
  //   );

  //   let data = res.json();
  //   console.log(data)
  //   if (res.status !== 200) {
  //     console.log(res);
  //     data = [];
  //   }
  //   return data;
  // }

  scaleGuac = (guac, windowWidth, windowHeight) => {
    let display = guac.getDisplay();
    let scale = Math.min(
      (windowWidth - 2 * DISPLAY_MARGIN - 16) * DISPLAY_WIDTH_PERCENT / 100 / display.getWidth(),
      (windowHeight - 2 * DISPLAY_MARGIN - APPBAR_OFFSET - 8) / display.getHeight()
    );
    display.scale(scale)
  }

  setUpGuac = async () => {
    let tunnel;
    // if (window.WebSocket)
    //     tunnel = new Guacamole.ChainedTunnel(
    //         new Guacamole.WebSocketTunnel('ws://localhost:6001/websocket-tunnel'),
    //         new Guacamole.HTTPTunnel("http://localhost:6001", this.props.nodeId)
    //     );
    
    // // If no WebSocket, then use HTTP.
    // else
    //     tunnel = new Guacamole.HTTPTunnel("http://localhost:6001", this.props.nodeId)
    // tunnel = new Guacamole.HTTPTunnel("http://localhost:6001", this.props.nodeId)
    tunnel = new Guacamole.WebSocketTunnel('ws://localhost:6001/tunnel/websocket-tunnel');
    var guac = new Guacamole.Client(
      // new Guacamole.HTTPTunnel("http://127.0.0.1:64365/tunnel")
      // new Guacamole.WebSocketTunnel("http://localhost:6001", this.props.nodeId)
      tunnel
    );

    this.guac = guac;
    
    // Error handler
    guac.onerror = function(error) {
        console.log(error)
        // alert(error);
    };


    let displayElement = document.getElementById("display");
    displayElement.appendChild(guac.getDisplay().getElement());

    const url = `http://localhost:6001/node-connection?node_id=${this.props.nodeId}`;
    const res = await fetch(url);
    if (res.status === 200) {
      const connectionId = await res.json();
      guac.connect(connectionId);
    }

    guac.getDisplay().onresize = () => {
      this.setState({ isLoading: false })
      this.scaleGuac(guac, window.innerWidth, window.innerHeight)
    }

    // Disconnect on close
    window.onunload = function() {
      guac.disconnect();
    }
    window.onresize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight; // make const for appbar height
      this.setState({ displayWidth: window.innerWidth })
      this.scaleGuac(guac, windowWidth, windowHeight);
    }

    // Mouse
    var mouse = new Guacamole.Mouse(guac.getDisplay().getElement());

    const getScaledMouseState = (mouseState, display) => {

      // Scale event by current scale
      return new Guacamole.Mouse.State(
              mouseState.x / display.getScale(),
              mouseState.y / display.getScale(),
              mouseState.left,
              mouseState.middle,
              mouseState.right,
              mouseState.up,
              mouseState.down);

    };

    mouse.onmousedown = 
    mouse.onmouseup   =
    mouse.onmousemove = function(mouseState) {
      const scaledMouseState = getScaledMouseState(mouseState, guac.getDisplay());
        guac.sendMouseState(scaledMouseState);
    };

    // Keyboard
    var keyboard = new Guacamole.Keyboard(document);

    keyboard.onkeydown = function (keysym) {
        guac.sendKeyEvent(1, keysym);
    };

    keyboard.onkeyup = function (keysym) {
        guac.sendKeyEvent(0, keysym);
    };
    return guac;
  }
  
  render() {
    const { classes } = this.props;
    return (
      <Page title='Worker Details'>
        <Box className={classes.display}>
          <Grid container>
            <Grid 
              item
              className={classes.displayContainer}
            >
              {React.createElement("div", {id: "display"})}
            </Grid>
            <Grid item xs container className={classes.sideBar} spacing={2}>
              <Grid item xs={12}>
                <Paper className={classes.displayStatus}>
                  <Grid item xs={12}>
                    <Typography variant='h5'>
                      Worker #ALIWPNF2O3:
                    </Typography>
                    <Typography variant='subtitle1'>
                      Start Stop Reset
                    </Typography>
                    <Typography variant='subtitle1'>
                      Screen Control: Off
                    </Typography>
                    <Typography variant='subtitle1'>
                      Status: Executing
                    </Typography>
                    <Typography variant='subtitle1'>
                      Task: Supreme
                    </Typography>
                    <Typography variant='subtitle1'>
                      Uptime: 00:00:30
                    </Typography>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          
        </Box>
      </Page>
    );
  }
};

IndividualNode = withStyles(styles)(IndividualNode);

const tileCardStyles = theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    boxShadow: 'none',
    border: '1px solid #d3d3d38a',
    width: '150px',
    height: '150px',
    position: 'relative',
    '&:hover': {
      boxShadow: '0px 0px 5px lightgrey',
      cursor: 'pointer'
    }
  },
  container: {
    // position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: 'translate(-50%,-50%)',
    // width: 'max-content'
    
  },
  
});

class TileCard extends React.Component {
  render () {
    const { classes } = this.props;
    return (
      <Paper
        className={classes.paper}
        onClick={() => this.props.link ? this.props.history.push(this.props.link) : null}
      >
        <div className={classes.container}>
          <Grid container spacing={1} alignItems='center'>
            <Grid item xs={12}>
              {this.props.icon}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1'>
                {this.props.name}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

TileCard = withStyles(tileCardStyles)(TileCard);
TileCard = withRouter(TileCard);
