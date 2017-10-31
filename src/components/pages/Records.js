/**
 * @author Philip Van Raalte
 * @date 2017-10-17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import _ from 'lodash';
import {getSongs, getSingles, getAlbums, getWeek} from '../../actions';

class Records extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlbums: false
    };

    this.renderSingles = this.renderSingles.bind(this);
    this.renderAlbums = this.renderAlbums.bind(this);
  }

  componentWillMount() {
    this.props.getWeek();
    this.props.getSongs();
    this.props.getSingles();
    this.props.getAlbums();
  }

  renderSingles() {
    let {singles, week} = this.props;
    singles = _.sortBy(singles, (({released}) => {
      return -released;
    }));

    if(_.isEmpty(singles)){
      return (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa fa-file-audio-o fa-4x" aria-hidden="true"/>
          </div>
          <p className="empty-title h5">You haven't released any singles yet</p>
        </div>
      );
    }

    return(
      <div>
        <h4 className="text-center">Singles</h4>
        <div className="scrollable">
          {
            singles.map(({id, title, quality, released, salesLastWeek, sales}) => {
              const age = week - released;
              return(
                <div className="card" key={id}>
                  <div className="card-header">
                    <div className="card-title h5">{title}</div>
                  </div>
                  <div className="card-body">
                    Age: {`${age} ${age === 1 ? "week" : "weeks"}`}<br/>
                    Quality: {quality}<br/>
                    Sales Last Week: {salesLastWeek}<br/>
                    Total Sales: {sales}<br/>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  renderAlbums() {
    let {albums, week} = this.props;
    albums = _.sortBy(albums, (({released}) => {
      return -released;
    }));

    if(_.isEmpty(albums)){
      return (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa fa-file-audio-o fa-4x" aria-hidden="true"/>
          </div>
          <p className="empty-title h5">You haven't released any albums yet</p>
        </div>
      );
    }

    return(
      <div>
        <h4 className="text-center">Albums</h4>
        <div className="scrollable">
          {
            albums.map(({id, title, quality, released, salesLastWeek, sales}) => {
              return(
                <div className="card" key={id}>
                  <div className="card-header">
                    <div className="card-title h5">{title}</div>
                  </div>
                  <div className="card-body">
                    Age: {week - released} weeks<br/>
                    Quality: {quality}<br/>
                    Sales Last Week: {salesLastWeek}<br/>
                    Total Sales: {sales}<br/>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  render() {
    const {showAlbums} = this.state;
    const {songs, singles, albums} = this.props;
    return(
      <div className="page container" id="page-records">
        <div className="btn-group btn-group-block centered col-2">
          <Link to="/records/release" className="btn btn-lg btn-primary">
            Release New Record
          </Link>
        </div>
        <br/>
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
                <div className="form-group text-center">
                  {`Singles `}
                  <label className="form-switch">
                    <input type="checkbox"
                       onChange={(e) => {this.setState({showAlbums: e.target.checked})}}
                       checked={showAlbums}
                    />
                    <i className="form-icon"/> Albums
                  </label>
                </div>
                {
                  showAlbums
                  ?
                    this.renderAlbums()
                  :
                    this.renderSingles()
                }
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
    albums: state.albums,
    week: state.week
  };
}

export default connect(mapStateToProps, {getSongs, getSingles, getAlbums, getWeek})(Records);