/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Page, Button} from '../SpectreCSS';

class Tour extends Component {
  render() {
    return(
      <Page>
        <div className="centered text-center">
          <Button large primary>Go on Tour</Button>
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
      </Page>
    );
  }
}

export default Tour;