/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Members extends Component {
  render() {
    return (
      <div className="page container">
        <h3>Members</h3>
        <Link to="/">
          Home
        </Link>
      </div>
    );
  }
}

export default Members;