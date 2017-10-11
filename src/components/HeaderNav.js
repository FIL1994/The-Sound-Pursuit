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
    if(match.url === "/" && !match.isExact){
      return false;
    }
    return true;
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
        <section/>{/* remove to put nav on right side */}
      </header>
    );
  }
}

export default withRouter(HeaderNav);