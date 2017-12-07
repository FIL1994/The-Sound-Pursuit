/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Page} from '../SpectreCSS';

class Members extends Component {
  render() {
    return (
      <Page>
        <h3>Members</h3>
        <Link to="/">
          Home
        </Link>
      </Page>
    );
  }
}

export default Members;