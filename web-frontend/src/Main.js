import React from 'react';
import {
  Route,
  BrowserRouter,
  Switch
} from 'react-router-dom';
import {
  CircularProgress,
  CssBaseline
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppContainer from './app/components/AppContainer/AppContainer';
import HomePage from './app/pages/HomePage/HomePage';
import NotFoundPage from './app/pages/NotFoundPage/NotFoundPage';
import IndividualNodePage from './app/pages/IndividualNode/IndividualNode';


const loaderStyles = makeStyles(theme => ({
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: "fixed",
    alignItems: "center",
    width: "100%",
    height: "100%"
  }
}));

function Loader() {
  const classes = loaderStyles();
  return (
    <div className={classes.loaderContainer}>
      <CircularProgress/>
    </div>
    
  )
}

const appStyles = (theme) => ({
  appContainer: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  handleAuthStateChanged = async (user) => {
    this.setState({ isLoading: true });
    await this.props.setAuthStatus(user);
    this.setState({ isLoading: false });
  }

  render () {
    if (this.state.isLoading) return <Loader/>
    return (
      <>
        <CssBaseline/>
        <BrowserRouter>
          {
            <AppContainer>
              <Switch>
                <Route exact path='/' render={props => <HomePage/>}/>
                <Route path='/node/:nodeId' render={props => <IndividualNodePage nodeId={props.match.params.nodeId}/>}/>
                <Route component={NotFoundPage}/>
              </Switch>
            </AppContainer>
          }
        </BrowserRouter>
      </>
    )
  }
}

Main = withStyles(appStyles)(Main);
export default Main;
