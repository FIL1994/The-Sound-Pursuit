/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink, matchPath, withRouter} from 'react-router-dom';
import _ from 'lodash';
import {getFans, getCash, getWeek} from '../actions';

class HeaderNav extends Component {
  constructor(props){
    super(props);
    this.isLinkActive = this.isLinkActive.bind(this);
  }

  componentWillMount() {
    this.props.getCash();
    this.props.getFans();
    this.props.getWeek();
  }

  isLinkActive(match) {
    if(!match) {
      return false
    }
    return !(match.url === "/" && !match.isExact);
  }

  renderLinks() {
    return [
      <NavLink
        key="home"
        to="/"
        className="btn btn-lg"
        activeClassName="btn-primary"
        isActive={this.isLinkActive}
      >
        Home
      </NavLink>,
      <NavLink
        key="songs"
        to="/songs"
        className="btn btn-lg"
        activeClassName="btn-primary"
        isActive={this.isLinkActive}
      >
        Songs
      </NavLink>,
      <NavLink
        key="records"
        to="/records"
        className="btn btn-lg"
        activeClassName="btn-primary"
        isActive={this.isLinkActive}
      >
        Records
      </NavLink>
    ];
  }

  render() {
    const isMatch = matchPath(this.props.location.pathname, {
      path: "/start",
      strict: false,
      isExact: true
    });

    return(
      <header className="navbar bg-dark">
        <section className="navbar-section">
          {isMatch ? <a className="btn btn-lg">Home</a> : this.renderLinks()}
        </section>
        <section className="navbar section text-light">
          <h6 className="centered p-2 tooltip tooltip-bottom" data-tooltip="Fans">
            <i className="icon icon-people"/>
            <span className="left-space-1">
              {_.isNumber(this.props.fans) ? this.props.fans : <div className="loading"/>}
            </span>
          </h6>
          <h6 className="centered p-2">
            {_.isNumber(this.props.cash) ? `$${this.props.cash}` : <div className="loading"/>}
          </h6>
          <h6 className="centered p-2">
            {_.isNumber(this.props.week) ? `Week ${this.props.week}` : <div className="loading"/>}
          </h6>
        </section>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    week: state.week,
    cash: state.cash,
    fans: state.fans
  };
}

export default withRouter(connect(mapStateToProps, {getFans, getCash, getWeek})(HeaderNav));