/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

import HasStarted from './components/HasStarted';
import HeaderNav from './components/HeaderNav';
import Home from './components/pages/Home';
import Members from './components/pages/Members';
import Start from './components/pages/Start';

class App extends Component {
  render() {
    return(
      <BrowserRouter>
        <div className="site">
          <HasStarted/>
          <HeaderNav/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/members/" component={Members}/>
            <Route exact path="/start/" component={Start}/>
            <Redirect to="/"/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;