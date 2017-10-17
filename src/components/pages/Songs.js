/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import $ from 'jquery';
import _ from 'lodash';
import getRandomSongName from '../../data/randomSongName';
import {getBand, getCash, saveCash, getSongs, writeSong, deleteSong, updateSong, nextWeek} from '../../actions';
import studios from '../../data/studios';

class Songs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorRecording: null,
      studioID: 0
    };

    this.writeSongSubmit = this.writeSongSubmit.bind(this);
    this.renderSongList = this.renderSongList.bind(this);
    this.editSongSubmit = this.editSongSubmit.bind(this);
    this.renderModalEditSong = this.renderModalEditSong.bind(this);
    this.renderModalRecordSong = this.renderModalRecordSong.bind(this);
    this.recordSongSubmit = this.recordSongSubmit.bind(this);
  }

  componentWillMount() {
    this.props.getBand();
    this.props.getSongs();
    this.props.getCash();
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
      quality: Number(_.random(avgSongwriting, maxSongwriting, true).toFixed(2)),
      recording: null,
      single: null, // id of single
      album: null // id of album
    };

    this.props.writeSong(song);
    this.props.nextWeek();
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

  recordSongSubmit() {
    if(this.state.errorRecording) {
      return;
    }
    let {cash} = this.props;
    let id, selectStudio = $('#selectStudio');
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

  renderModalRecordSong() {
    const buttonSubmitProps = this.state.errorRecording
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
                <select id="selectStudio" className={`form-select ${this.state.errorRecording ? 'is-error' : ''}`}
                  onChange={
                    (event) =>
                    {
                      let studioID = event.target.value, errorRecording = null;

                      console.log(
                        studios[studioID].cost,
                        this.props.cash
                      );

                      if(studios[studioID].cost > this.props.cash) {
                        errorRecording = "You don't have enough cash.";
                      }

                      this.setState({
                        studioID,
                        errorRecording
                      });
                    }
                  }
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
                  {this.state.errorRecording}
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
          <i className="icon icon-3x icon-edit"/>
        </div>
        <p className="empty-title h5">You haven't written any songs yet</p>
      </div>
    );
  }

  renderSongList(songs) {
    songs = songs.filter(({single, album}) => {
      return !(_.isNumber(single) || _.isNumber(album));
    });

    return (
      <table className="table table-striped table-hover text-center">
        <thead>
          <tr>
            <th>Title</th>
            <th>Quality</th>
            <th>Recording</th>
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
    songs: state.songs,
    cash: state.cash
  };
}

export default connect(mapStateToProps, {getBand, getCash, saveCash, getSongs, writeSong, updateSong,
  deleteSong, nextWeek})(Songs);