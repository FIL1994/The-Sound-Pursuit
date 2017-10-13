/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import _ from 'lodash';

class Tour extends Component {
  render() {
    return(
      <div className="page container">
        <div className="centered text-center">
          <button type="button" className="btn btn-lg btn-primary">Go on Tour</button>
        </div>
        <div className="empty">
          <div className="empty-icon">
            <i className="icon icon-3x icon-people"/>
          </div>
          <p className="empty-title h5">You don't have enough songs to go on tour</p>
          <div className="empty-action">
            <Link to="/songs" className="btn btn-primary">Go to Songs</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Tour;