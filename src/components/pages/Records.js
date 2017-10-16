/**
 * @author Philip Van Raalte
 * @date 2017-10-16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import $ from 'jquery';
import _ from 'lodash';
import {getBand, getCash, saveCash, getSongs, updateSong, nextWeek} from '../../actions';
import getRandomSongName from '../../data/randomSongName';
import producers from '../../data/producers';

class Records extends Component {
  constructor(props) {
    super(props);

    this.renderSongList = this.renderSongList.bind(this);
    this.renderProducers = this.renderProducers.bind(this);

    this.state = {
      isSingle: true
    };
  }

  componentWillMount() {
    this.props.getBand();
    this.props.getSongs();
    this.props.getCash();
  }

  renderProducers() {
    return(
      <div className="form-group centered text-center">
        <label className="form-label">Select a producer:</label>
        {
          producers.map(({name, quality, cost}, index) => {
            return(
              <label className="form-radio" key={index}>
                <input type="radio" name="producers"/>
                <i className="form-icon"/> {name}
              </label>
            )
          })
        }
      </div>
    );
  }

  renderSongList(songs) {
    if(_.isEmpty(songs)) {
      return;
    }

    const {isSingle} = this.state;
    if(isSingle) {
      songs = songs.filter((s) => {
        // return songs that are recorded and not on a single
        return !_.isNumber(s.single) && _.isNumber(s.recording);
      });
    } else {
      songs = songs.filter((s) => {
        // return songs that are recorded and not on an album
        return !_.isNumber(s.album) && _.isNumber(s.recording);
      });
    }

    const songList = isSingle
      ?
        <div className="form-group centered text-center">
          <label className="form-label">Select Song:</label>
          {
            songs.map(({id, title}) => {
              return (
                <label className="form-radio" key={id}>
                  <input type="radio" name="songs"/>
                  <i className="form-icon"/> {title}
                </label>
              )
            })
          }
        </div>
      :
        <div className="form-group centered text-center">
          <div className="form-group">
            <label className="form-label" htmlFor="txtAlbumTitle">Album Title:</label>
            <div className="input-group">
              <input className="form-input" type="text" id="txtAlbumTitle" placeholder="Album Title"/>
              <button className="btn input-group-btn" type="button"
                onClick={() => {$('#txtAlbumTitle').val(getRandomSongName())}}
              >
                Random
              </button>
            </div>
          </div>
          <label className="form-label">Select Songs:</label>
          {
            songs.map(({id, title}) => {
              return (
                <label key={id} className="form-checkbox">
                  <input type="checkbox"/>
                  <i className="form-icon"/> {title}
                </label>
              )
            })
          }
        </div>;

    return songList;
  }

  render() {
    const {isSingle} = this.state;

    return (
      <div className="page container" id="page-records">
        <div className="centered text-center">
          <div className="btn-group btn-group-block centered col-4">
            <button type="button" className={`btn btn-lg ${isSingle ? 'btn-primary' : ''}`}
              onClick={() => {this.setState({isSingle: true})}}
            >
              Single
            </button>
            <button type="button" className={`btn btn-lg ${isSingle ? '' : 'btn-primary'}`}
              onClick={() => {this.setState({isSingle: false})}}
            >
              Album
            </button>
          </div>
        </div>
        <br/>
        <div className="panel">
          <form className="centered col-10 panel-body">
            {this.renderSongList(this.props.songs)}
            <div className="divider"/>
            {this.renderProducers()}
            <button type="button" className="text-center centered btn btn-primary">Submit</button>
          </form>
        </div>
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

export default connect(mapStateToProps, {getBand, getCash, saveCash, getSongs, updateSong, nextWeek})(Records);