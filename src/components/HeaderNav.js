/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink, matchPath, withRouter} from 'react-router-dom';
import _ from 'lodash';
import {getFans, getCash, getWeek} from '../actions';
import localForage, {DATA_BAND} from '../data/localForage';

class HeaderNav extends Component {
  constructor(props){
    super(props);

    this.state = {
      hasStarted: false
    }

    this.isLinkActive = this.isLinkActive.bind(this);
    this.getParamHasStarted = this.getParamHasStarted.bind(this);
  }

  componentWillMount() {
    this.props.getCash();
    this.props.getFans();
    this.props.getWeek();
  }

  componentDidUpdate() {
    setTimeout(() => {
      localForage.getItem(DATA_BAND, (err, value) => {
        const hasStarted = _.isEmpty(err) && !_.isEmpty(value);

        if(this.state.hasStarted !== hasStarted) {
          this.setState({
            hasStarted
          });
        }
      });
    });
  }

  isLinkActive(match) {
    if(!match) {
      return false
    }
    return !(match.url === "/" && !match.isExact);
  }

  formatNumber(number, isFloat) {
    if(number > 1000000000) {
      return `${(number / 1000000000).toFixed(2)}B`;
    } else if (number > 1000000) {
      return `${(number / 1000000).toFixed(2)}M`;
    } else if (number > 1000) {
      return `${(number / 1000).toFixed(2)}K`;
    } else {
      return isFloat ? number.toFixed(2) : _.ceil(number);
    }
  }

  renderLinks() {
    return [
      <NavLink
        key="dashboard"
        to="/dashboard"
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

  getParamHasStarted() {
    const {search} = this.props.location;
    let paramHasStarted = "";

    if(!_.isEmpty(search)) {
      // get the param by decoding the uri to remove strings such as '%20' and split the string on 'hasStarted=' and '&'
      paramHasStarted = decodeURI(search).split("hasStarted=")[1].split("&")[0].trim();
    }

    return paramHasStarted === "true";
  }

  render() {
    let hasStarted = this.getParamHasStarted();
    if(!hasStarted) {
      hasStarted = this.state.hasStarted;
    }

    const isStart = matchPath(this.props.location.pathname, {
      path: "/start",
      strict: false,
      isExact: true
    });

    if(this.props.location.pathname === "/") {
      return null;
    }
    return(
      <header className="navbar bg-dark">
        <section className="navbar-section">
          {!_.isEmpty(isStart) || !hasStarted ? <NavLink to="/" className="btn btn-lg">Back to Main Menu</NavLink> : this.renderLinks()}
        </section>
        <section className="navbar section text-light">
          <h6 className="centered p-2 tooltip tooltip-bottom" data-tooltip={`${this.props.fans} Fans`}>
            <i className="icon icon-people"/>
            <span className="left-space-1">
              {_.isNumber(this.props.fans) ? this.formatNumber(this.props.fans, false) : <div className="loading"/>}
            </span>
          </h6>
          <h6 className="centered p-2 tooltip tooltip-bottom" data-tooltip={`$${this.props.cash}`}>
            {_.isNumber(this.props.cash) ? `$${this.formatNumber(this.props.cash, true)}` : <div className="loading"/>}
          </h6>
          <h6 className="centered p-2">
            {_.isNumber(this.props.week) ? `Week ${this.props.week}` : <div className="loading"/>}
          </h6>
          <NavLink
            to={{
              pathname: "/settings",
              search: `?hasStarted=${hasStarted.toString()}`
            }}
            className="text-light centered p-2 tooltip tooltip-bottom"
            data-tooltip="Settings"
          >
            <i className="fa fa-cog my-icon" aria-hidden="true"/>
          </NavLink>
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