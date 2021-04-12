import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  withStyles
} from '@material-ui/core/styles';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Page from '../../components/Page/Page';
import config from '../../../config/config';


const homePageStyles = theme => ({
  container: {
    padding: theme.spacing(3)
  },
  nodeEntry: {
    padding: theme.spacing(1),
    boxShadow: 'none',
    border: '1px solid lightgray',
    '&:hover': {
      boxShadow: '0px 0px 5px lightgrey',
      cursor: 'pointer'
    }
  }
})

export default class HomePage extends React.Component {

  state = {
    nodes: []
  }

  componentDidMount() {
    this.get_active_nodes().then(nodes => {
      this.setState({ nodes });
    });
  }
  
  get_active_nodes = async () => {
    const res = await fetch(
      `${config.SERVER_BASE_URL}/nodes`
    );

    let data = res.json();
    console.log(data)
    if (res.status !== 200) {
      console.log(res);
      data = [];
    }
    return data;
  }

  renderNodes = () => {
    const { classes } = this.props;
    return this.state.nodes.map(node => (
      <Grid item xs={12} key={node.id}>
        <Link to={`/node/${node.id}`} style={{ textDecoration: 'none' }}>
          <Paper
            className={classes.nodeEntry}
          >
            <Typography variant='body2'>
              {node.id}
            </Typography>
          </Paper>
        </Link>
      </Grid>
    ))
  }
  
  render() {
    const { classes } = this.props;
    return (
      <Page title='Home'>
        <div className={classes.container}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant='subtitle1'>
                {this.state.nodes.length} Active workers:
              </Typography>
            </Grid>
            {this.renderNodes()}
          </Grid>
        </div>
      </Page>
    );
  }
};

HomePage = withStyles(homePageStyles)(HomePage);

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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 'max-content'
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
