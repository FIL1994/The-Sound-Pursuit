/**
 * @author Philip Van Raalte
 * @date 2017-10-17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import _ from 'lodash';
import {getSongs, getSingles, getAlbums} from '../../actions';

class Records extends Component {
  componentWillMount() {
    this.props.getSongs();
    this.props.getSingles();
    this.props.getAlbums();
  }

  render() {
    const {songs, singles, albums} = this.props;
    return(
      <div className="page container" id="page-records">
        <div className="btn-group btn-group-block centered col-2">
          <Link to="/records/release" className="btn btn-lg btn-primary">
            Release New Record
          </Link>
        </div>
        <div>
          {
            _.isEmpty(singles) && _.isEmpty(albums)
            ?
              <div className="empty">
                <div className="empty-icon">
                  <i className="fa fa-file-audio-o fa-4x" aria-hidden="true"/>
                </div>
                <p className="empty-title h5">You haven't released any records yet</p>
              </div>
            :
              <div>
                records
              </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    songs: state.songs,
    singles: state.singles,
    albums: state.albums
  };
}

export default connect(mapStateToProps, {getSongs, getSingles, getAlbums})(Records);