/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import $ from 'jquery';
import _ from 'lodash';
import getRandomSongName from '../../data/randomSongName';
import {getBand, getCash, saveCash, getSongs, writeSong, deleteSong, updateSong, getWeek, nextWeek} from '../../actions';
import studios from '../../data/studios';
import {unlockWriteSong, unlockRecordSong} from '../../ng/UnlockMedals';

class Songs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorRecording: null,
      studioID: 0,
      column: "written",
      sortAsc: false
    };

    this.writeSongSubmit = this.writeSongSubmit.bind(this);
    this.renderSongList = this.renderSongList.bind(this);
    this.editSongSubmit = this.editSongSubmit.bind(this);
    this.renderModalEditSong = this.renderModalEditSong.bind(this);
    this.renderModalRecordSong = this.renderModalRecordSong.bind(this);
    this.recordSongSubmit = this.recordSongSubmit.bind(this);
    this.validateStudioSelect = this.validateStudioSelect.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.sortSongs = this.sortSongs.bind(this);
    this.renderIcon = this.renderIcon.bind(this);
  }

  componentWillMount() {
    this.props.getBand();
    this.props.getSongs();
    this.props.getCash();
    this.props.getWeek();
  }

  handleSort(clickedColumn) {
    let {column, sortAsc} = this.state;

    if(column !== clickedColumn) {
      sortAsc = true;
    } else {
      sortAsc = !sortAsc;
    }

    this.setState({
      column: clickedColumn,
      sortAsc
    });
  }

  sortSongs() {
    let {songs} = this.props;
    const {column, sortAsc} = this.state;

    return _.orderBy(songs, [column], [sortAsc ? 'asc' : 'desc']);
  }

  writeSongSubmit() {
    let txtSongName = $('#txtSongName');
    if(_.isEmpty(this.props.band)) {
      return;
    }
    let songTitle = txtSongName.val();

    if(_.isEmpty(songTitle)) {
      songTitle = getRandomSongName();
    } else {
      txtSongName.val('');
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
      quality: Number(_.random(avgSongwriting, maxSongwriting, true).toFixed(2)),
      recording: null,
      single: null, // id of single
      album: null, // id of album
      written: this.props.week
    };

    unlockWriteSong();
    this.props.writeSong(song);
    this.props.nextWeek();
  }

  editSongSubmit() {
    let id, txtNewSongName = $("#txtNewSongName");
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

  recordSongSubmit() {
    if(this.state.errorRecording) {
      return;
    }
    let {cash} = this.props;
    let id, selectStudio = $("#selectStudio");
    let studioID = selectStudio.val();
    try {
      id = Number(selectStudio.data().id);
    } catch(e) {
      return;
    }
    if(!_.isNumber(id)) {
      console.log("id not a number", id);
      return;
    }
    const studio = studios[studioID];
    if(studio.cost > cash) {
      return;
    } else {
      cash -= studio.cost;
    }

    const {songs, band: {leadMember, members}} = this.props;

    let song = _.find(songs, (s) => {
      return s.id === id;
    });
    if(_.isEmpty(song)) {
      return;
    }

    let maxSkill = 0, sumSkill = 0, avgSkill;

    [...members, leadMember].forEach(({skills: {studio, musicianship}}) => {
      const skill = ((studio * 3) + musicianship) / 4;
      if(skill > maxSkill) {
        maxSkill = skill;
      }
      sumSkill += skill;
    });

    avgSkill = sumSkill / members.length+1;

    //calculate recording quality
    let quality = (_.random(avgSkill, maxSkill) + studio.quality)/2;
    quality = Number(quality.toFixed(2));
    song.recording = quality;

    unlockRecordSong();
    this.props.saveCash(cash);
    this.props.updateSong(song);
    this.props.nextWeek();
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
                <div className="input-group col-9">
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
            <a href="#page-songs" className="btn btn-link">Close</a>
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
            <a href="#page-songs" className="btn btn-link">Close</a>
          </div>
        </form>
      </div>
    );
  }

  validateStudioSelect(event, initialCheck) {
    let studioID, errorRecording = null;

    try {
      studioID = event.target.value;
    } catch(e) {
      studioID = Number($('#selectStudio').val());
    }

    if(_.isNaN(studioID)) {
      return;
    }

    if(studios[studioID].cost > this.props.cash) {
      errorRecording = "You don't have enough cash.";
    }

    if((_.isBoolean(initialCheck) ? !initialCheck : true) && (studioID !== this.state.studioID)) {
      this.setState({
        studioID
      });
    }

    return errorRecording;
  }

  renderModalRecordSong() {
    const errorRecording = this.validateStudioSelect(null, true);
    const buttonSubmitProps = errorRecording
      ?
        {
          className: "btn btn-primary disabled",
          disabled: true,
          tabIndex: "-1"
        }
      :
        {
          className: "btn btn-primary"
        };

    return (
      <div id="modal-record-song" className="modal modal-sm">
        <a href="#page-songs" className="modal-overlay" aria-label="Close"/>
        <form className="modal-container" onSubmit={this.recordSongSubmit} action="#page-songs">
          <div className="modal-header">
            <a href="#page-songs" className="btn btn-clear float-right" aria-label="Close"/>
            <div className="modal-title h5 text-center">Record Song</div>
          </div>
          <div className="modal-body">
            <div className="content">
              <div className="form-group">
                <label htmlFor="#selectStudio">Select Studio:</label>
                <select id="selectStudio" className={`form-select ${errorRecording ? 'is-error' : ''}`}
                  onChange={this.validateStudioSelect}
                >
                  {
                    studios.map(({name}, index) => {
                      return(
                        <option key={name} value={index}>{name}</option>
                      );
                    })
                  }
                </select>
                <div className="form-input-hint">
                  {errorRecording}
                </div>
              </div>
              <div>
                Cost: ${studios[this.state.studioID].cost} <br/>
                Quality: {studios[this.state.studioID].quality}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a href="#page-songs" onClick={this.recordSongSubmit} {...buttonSubmitProps}>
              Submit
            </a>
            <a href="#page-songs" className="btn btn-link">Close</a>
          </div>
        </form>
      </div>
    );
  }

  renderEmpty() {
    return (
      <div className="empty">
        <div className="empty-icon">
          <i className="fa fa-music fa-4x"/>
        </div>
        <p className="empty-title h5">You haven't written any songs yet</p>
      </div>
    );
  }

  renderIcon(thisColumn, isString) {
    const {column, sortAsc} = this.state;
    let className = "fa fa-sort";

    if(thisColumn === column) {
      if(isString) {
        className = sortAsc ? "fa fa-sort-alpha-asc " : "fa fa-sort-alpha-desc";
      }
      else {
        className = sortAsc ? "fa fa-sort-numeric-asc" : "fa fa-sort-numeric-desc";
      }
    }

    return <i className={className} aria-hidden="true"/>;
  }

  getUsableSongs(songs) {
    try {
      songs = songs.filter(({single, album}) => {
        return !(_.isNumber(single) || _.isNumber(album));
      });
    } catch (e) {
      songs = [];
    }

    return songs;
  }

  renderSongList() {
    let songs = this.getUsableSongs(this.sortSongs());

    if(songs.length < 1) {
      return (
        <div className="empty">
          <div className="empty-icon">
            <i className="fa fa-pencil fa-4x"/>
          </div>
          <p className="empty-title h5">You don't have any unreleased songs</p>
        </div>
      );
    }

    return (
      <table className="table table-striped table-hover text-center">
        <thead>
          <tr>
            <th className="c-hand" onClick={() => {this.handleSort('title')}}>
              {`Title `}
              {this.renderIcon('title', true)}
            </th>
            <th className="c-hand" onClick={() => {this.handleSort('written')}}>
              {`Written `}
              {this.renderIcon('written', false)}
            </th>
            <th className="c-hand" onClick={() => {this.handleSort('quality')}}>
              {`Quality `}
              {this.renderIcon('quality', false)}
            </th>
            <th className="c-hand" onClick={() => {this.handleSort('recording')}}>
              {`Recording `}
              {this.renderIcon('recording', false)}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            songs.map((s) => {
              return(
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.written}</td>
                  <td>{s.quality}</td>
                  <td>{s.recording}</td>
                  <td>
                    <div className="btn-group">
                      <a href="#modal-record-song" className="btn"
                        onClick={() => {
                          $('#selectStudio').data('id', s.id);
                        }}
                      >
                        Record
                      </a>
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
    const usableSongs = this.getUsableSongs(songs);

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
          {this.renderModalRecordSong()}
        </div>
        {
          _.isEmpty(songs)
          ?
            this.renderEmpty()
          :
            <div className="col-10 centered">
              <h5 className="text-left">Unreleased Songs: {usableSongs.length}</h5>
              <br/>
              <div className="scrollable">
                {this.renderSongList()}
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
    songs: state.songs,
    cash: state.cash,
    week: state.week
  };
}

export default connect(mapStateToProps, {getBand, getCash, saveCash, getSongs, writeSong, updateSong,
  deleteSong, getWeek, nextWeek})(Songs);