/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import $ from 'jquery';
import _ from 'lodash';
import getRandomSongName from '../../data/randomSongName';
import {getBand, getSongs, writeSong, deleteSong, updateSong} from "../../actions";

class Songs extends Component {
  constructor(props) {
    super(props);

    this.state = {error: null};

    this.writeSongSubmit = this.writeSongSubmit.bind(this);
    this.renderSongList = this.renderSongList.bind(this);
    this.editSongSubmit = this.editSongSubmit.bind(this);
    this.renderModalEditSong = this.renderModalEditSong.bind(this);
    // this.renderEmpty = this.renderEmpty.bind(this);
  }

  componentWillMount() {
    this.props.getBand();
    this.props.getSongs();
  }

  writeSongSubmit() {
    if(_.isEmpty(this.props.band)) {
      return;
    }
    let songTitle = $('#txtSongName').val();

    if(_.isEmpty(songTitle)) {
      songTitle = getRandomSongName();
    } else {
      $('#txtSongName').val('');
    }

    songTitle = _.truncate(songTitle, {length: 30});

    const leadMember = _.cloneDeep(this.props.band.leadMember);
    let members = _.cloneDeep(this.props.band.members);

    members.push(leadMember);
    let maxSongwriting = 0, sumSongwriting = 0;
    members.forEach(({skills: {songwriting}}) => {
      if(songwriting > maxSongwriting) {
        maxSongwriting = songwriting;
      }
      sumSongwriting += songwriting;
    });
    const avgSongwriting = sumSongwriting / members.length;

    if(maxSongwriting > 98) {
      maxSongwriting += 2;
    }

    const song = {
      title: songTitle,
      quality: Number(_.random(avgSongwriting, maxSongwriting, true).toFixed(2))
    };

    this.props.writeSong(song);
  }

  editSongSubmit() {
    let id, txtNewSongName = $('#txtNewSongName');
    try {
      id = Number(txtNewSongName.data().id);
    } catch(e) {
      return;
    }
    if(!_.isNumber(id)) {
      console.log("id not a number", id);
      return;
    }

    const {songs} = this.props;
    let songTitle = txtNewSongName.val();

    let song = _.find(songs, (s) => {
      return s.id === id;
    });
    if(_.isEmpty(song)) {
      return;
    }

    if(_.isEmpty(songTitle)) {
      songTitle = getRandomSongName();
    }

    song.title = songTitle;
    this.props.updateSong(song);
  }

  renderModalWriteSong() {
    return(
      <div id="modal-write-song" className="modal modal-sm">
        <a href="#page-songs" className="modal-overlay" aria-label="Close"/>
        <form className="modal-container" onSubmit={this.writeSongSubmit} action="#page-songs">
          <div className="modal-header">
            <a href="#page-songs" className="btn btn-clear float-right" aria-label="Close"/>
            <div className="modal-title h5 text-center">Write a Song</div>
          </div>
          <div className="modal-body">
            <div className="content">
              <div className="form-group">
                <div className="input-group">
                  <input id="txtSongName" className="form-input" placeholder="Song Name" type="text"/>
                  <button className="btn input-group-btn" type="button"
                    onClick={() => $('#txtSongName').val(getRandomSongName())}
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#page-songs" onClick={this.writeSongSubmit} className="btn btn-primary">Submit</a>
            <a href="#page-songs" id="btnCloseWriteSong" className="btn btn-link">Close</a>
          </div>
        </form>
      </div>
    );
  }

  renderModalEditSong() {
    return(
      <div id="modal-edit-song" className="modal modal-sm">
        <a href="#page-songs" className="modal-overlay" aria-label="Close"/>
        <form className="modal-container" onSubmit={this.editSongSubmit} action="#page-songs">
          <div className="modal-header">
            <a href="#page-songs" className="btn btn-clear float-right" aria-label="Close"/>
            <div className="modal-title h5 text-center">Edit Song</div>
          </div>
          <div className="modal-body">
            <div className="content">
              <div className="form-group">
                <div className="input-group">
                  <input id="txtNewSongName" className="form-input" type="text"/>
                  <button className="btn input-group-btn" type="button"
                    onClick={() => $('#txtNewSongName').val(getRandomSongName())}
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#page-songs" onClick={this.editSongSubmit} className="btn btn-primary">Submit</a>
            <a href="#page-songs" id="btnCloseWriteSong" className="btn btn-link">Close</a>
          </div>
        </form>
      </div>
    );
  }

  renderEmpty() {
    return (
      <div className="empty">
        <div className="empty-icon">
          <i className="icon icon-3x icon-edit"/>
        </div>
        <p className="empty-title h5">You haven't written any songs yet</p>
      </div>
    );
  }

  renderSongList(songs) {
    return (
      <table className="table table-striped table-hover text-center">
        <thead>
          <tr>
            <th>Title</th>
            <th>Quality</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            songs.map((s) => {
              return(
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.quality}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn">Record</button>
                      <a href="#modal-edit-song" className="btn"
                         onClick={() => {
                           let txtNewSongName = $('#txtNewSongName');
                           txtNewSongName.val(s.title);
                           txtNewSongName.data('id', s.id);
                         }}>
                        Edit
                      </a>
                      <button className="btn" onClick={() => this.props.deleteSong(s.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }

  render() {
    const {songs} = this.props;

    return(
      <div className="page container" id="page-songs">
        <div className="centered text-center">
          <div className="btn-group btn-group-block centered col-2">
            <a href="#modal-write-song" className="btn btn-lg btn-primary">
              Write Song
            </a>
          </div>
          {this.renderModalWriteSong()}
          {this.renderModalEditSong()}
        </div>
        {
          _.isEmpty(songs)
          ?
            this.renderEmpty()
          :
            <div className="col-10 centered">
              <h5 className="text-left">Total Songs: {songs.length}</h5>
              <br/>
              <div className="scrollable">
                {this.renderSongList(songs)}
              </div>
            </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    band: state.band,
    songs: state.songs
  };
}

export default connect(mapStateToProps, {getBand, getSongs, writeSong, updateSong, deleteSong})(Songs);