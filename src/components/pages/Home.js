/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Home extends Component {
  render() {
    return(
      <div className="page container">
        <h3>Home</h3>
        <Link to="/members">
          Members
        </Link>
      </div>
    );
  }
}

export default Home;