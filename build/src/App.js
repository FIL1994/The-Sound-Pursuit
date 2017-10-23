/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import HasStarted from './components/HasStarted';
import HeaderNav from './components/HeaderNav';
import Dashboard from './components/pages/Dashboard';
import Start from './components/pages/Start';
import Songs from './components/pages/Songs';
import Records from './components/pages/Records';
import ReleaseRecord from './components/pages/ReleaseRecord';
import MainMenu from './components/pages/MainMenu';

class App extends Component {
  render() {
    return(
      <BrowserRouter>
        <div className="site">
          <HasStarted/>
          <HeaderNav/>
          <Switch>
            <Route exact path="/" component={MainMenu}/>
            <Route path="/start/" component={Start}/>
            <Route path="/dashboard/" component={Dashboard}/>
            <Route path="/songs/" component={Songs}/>
            <Route exact path="/records/" component={Records}/>
            <Route path="/records/release" component={ReleaseRecord}/>
            <Redirect to="/"/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;