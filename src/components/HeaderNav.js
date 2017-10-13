/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {NavLink, matchPath, withRouter} from 'react-router-dom';

class HeaderNav extends Component {
  constructor(props){
    super(props);
    this.isLinkActive = this.isLinkActive.bind(this);
    window.match = [];
  }

  isLinkActive(match, location) {
    if(!match) {
      return false
    }
    window.match.push({match, location});
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
        key="members"
        to="/members"
        className="btn btn-lg"
        activeClassName="btn-primary"
        isActive={this.isLinkActive}
      >
        Members
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
        key="tour"
        to="/tour"
        className="btn btn-lg"
        activeClassName="btn-primary"
        isActive={this.isLinkActive}
      >
        Tour
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
          <h6 className="centered p-2">$250</h6>
          <h6 className="centered p-2">Week 0</h6>
        </section>
      </header>
    );
  }
}

export default withRouter(HeaderNav);