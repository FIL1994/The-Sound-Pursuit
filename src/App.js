/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import _ from 'lodash';
import {getScore} from './actions/index';

import HasStarted from './components/HasStarted';
import HeaderNav from './components/HeaderNav';
import Dashboard from './components/pages/Dashboard';
import Start from './components/pages/Start';
import Songs from './components/pages/Songs';
import Records from './components/pages/Records';
import ReleaseRecord from './components/pages/ReleaseRecord';
import MainMenu from './components/pages/MainMenu';
import Settings from './components/pages/Settings';

class App extends Component {
  constructor(props) {
    super(props);

    this.renderModalScore = this.renderModalScore.bind(this);
    this.hideModalScore = this.hideModalScore.bind(this);

    this.state = {
      modalActive: true
    };
  }

  lastScore = {};

  hideModalScore() {
    this.setState({modalActive: false});
  }

  renderModalScore() {
    if(this.lastScore === this.props.score) {
      return;
    }

    this.lastScore = this.props.score;
    const {years, score} = this.lastScore;

    return (
      <div id="modal-score" className={`modal modal-sm active`}>
        <a href="#site" className="modal-overlay" aria-label="Close" onClick={this.hideModalScore}/>
        <div className="modal-container">
          <div className="modal-header">
            <a href="#site" className="btn btn-clear float-right" aria-label="Close" onClick={this.hideModalScore}/>
            <div className="modal-title h5 text-center">Been Around for {years} Years</div>
            <div className="modal-body">
              <div className="content">
                You band has latest {years} years! <br/>
                Your score of {score.toLocaleString()} has been submitted.
              </div>
            </div>
            <div className="modal-footer">
              <a href="#site" className="btn btn-link" onClick={this.hideModalScore}>Okay</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {score} = this.props;

    return(
      <BrowserRouter>
        <div id="site" className="site">
          <HasStarted/>
          <HeaderNav/>
          <Switch>
            <Route exact path="/" component={MainMenu}/>
            <Route path="/start/" component={Start}/>
            <Route path="/dashboard/" component={Dashboard}/>
            <Route path="/songs/" component={Songs}/>
            <Route exact path="/records/" component={Records}/>
            <Route path="/records/release/" component={ReleaseRecord}/>
            <Route path="/settings/" component={Settings}/>
            <Redirect to="/"/>
          </Switch>
          {_.isEmpty(score) ? null : this.renderModalScore()}
        </div>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    score: state.score
  };
}

export default connect(mapStateToProps, {getScore})(App);