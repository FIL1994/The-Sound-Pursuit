/**
 * @author Philip Van Raalte
 * @date 2017-10-16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import $ from 'jquery';
import _ from 'lodash';
import {getBand, getCash, saveCash, getSongs, updateSong, nextWeek, getWeek} from '../../actions';
import getRandomSongName from '../../data/randomSongName';
import producers from '../../data/producers';

class Records extends Component {
  constructor(props) {
    super(props);

    this.renderSongList = this.renderSongList.bind(this);
    this.renderProducers = this.renderProducers.bind(this);
    this.renderProducerDetails = this.renderProducerDetails.bind(this);
    this.validateAlbum = this.validateAlbum.bind(this);
    this.validateSingle = this.validateSingle.bind(this);
    this.changedProducer = this.changedProducer.bind(this);

    this.state = {
      isSingle: true,
      producerID: null,
      errorProducer: null,
      errorSingle: null,
      errorAlbum: null
    };
  }

  componentWillMount() {
    this.props.getBand();
    this.props.getSongs();
    this.props.getCash();
    this.props.getWeek();
  }

  renderProducers() {
    const {errorProducer} = this.state;
    return(
      <div>
        <div className={`form-group centered text-center ${!_.isEmpty(errorProducer) ? 'has-error' : ''}`}
           onChange={this.changedProducer}
        >
          <label className="form-label">Select a producer:</label>
          {
            producers.map(({name, quality, cost}, index) => {
              return(
                <label className="form-radio" key={index}>
                  <input type="radio" name="producers" value={index}/>
                  <i className="form-icon"/> {name}
                </label>
              )
            })
          }
        </div>
        <div className="form-input-hint is-error text-center">
          {errorProducer}
        </div>
      </div>
    );
  }

  renderProducerDetails() {
    const {producerID, isSingle} = this.state;
    if(!_.isNumber(producerID)){
      return;
    }
    const producer = producers[producerID];
    return(
      <div className="text-center">
        Quality: {producer.quality} <br/>
        Cost: ${isSingle ? producer.cost.single : producer.cost.album}
      </div>
    );
  }

  renderSongList(songs) {
    if(_.isEmpty(songs)) {
      return;
    }

    const {isSingle, errorSingle, errorAlbum} = this.state;
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
        <div>
          <div className={`form-group centered text-center ${!_.isEmpty(errorSingle) ? 'has-error' : ''}`}>
            <label className="form-label">Select Song:</label>
            {
              songs.map(({id, title}) => {
                return (
                  <label className="form-radio" key={id}>
                    <input type="radio" value={id} name="songs"/>
                    <i className="form-icon"/> {title}
                  </label>
                )
              })
            }
          </div>
          <div className="form-input-hint is-error text-center">
            {errorSingle}
          </div>
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
          <div>
            <div onChange={(() => {console.log("album select changed")})}>
              <label className="form-label">Select Songs:</label>
              {
                songs.map(({id, title}) => {
                  return (
                    <label key={id} className={`form-checkbox ${!_.isEmpty(errorAlbum) ? 'has-error' : ''}`}>
                      <input type="checkbox" value={id}/>
                      <i className="form-icon"/> {title}
                    </label>
                  )
                })
              }
            </div>
            <div className="form-input-hint is-error text-center">
              {errorAlbum}
            </div>
          </div>
        </div>;

    return songList;
  }

  changedProducer() {
    let producerID = $('input[name=producers]:checked').val();
    producerID = Number(producerID);

    if(_.isFinite(producerID) && this.state.producerID !== producerID) {
      this.setState({
        producerID
      })
    }
  }

  validateAlbum() {
    let errorProducer = null, errorAlbum = null, producer, checkboxes = [];
    // album title
    let albumTitle = $('#txtAlbumTitle').val();
    if(_.isEmpty(albumTitle)) {
      albumTitle = getRandomSongName();
    }

    // song select
    $("form input:checked").each(function() {
      checkboxes.push(Number($( this ).val()));
    });
    if(checkboxes.length < 8) {
      errorAlbum = <div>You must select at least 8 songs.<br/>You selected {checkboxes.length}.</div>;
    } else if (checkboxes.length > 16) {
      errorAlbum = <div>You can select a maximum of 16 songs.<br/>You selected {checkboxes.length}.</div>;
    }

    // producer select
    const producerID = Number($('input[name=producers]:checked').val());
    if(_.isFinite(producerID)) {
      producer = producers[Number(producerID)];
    } else {
      errorProducer = "You must select a producer";
    }
    if(!_.isEmpty(errorProducer) || !_.isEmpty(errorAlbum)) {
      let album = {
        title: albumTitle,
        songs: checkboxes,
        released: this.props.week,
        sales: 0,
        salesLastWeek: 0
      };
      // get album id and save songs
      this.props.nextWeek();
    }

    this.setState({
      errorProducer,
      errorAlbum
    });

    console.log(albumTitle, checkboxes, producer);
  }

  validateSingle() {
    let errorProducer = null, errorSingle = null, song, producer;
    const songID = Number($('input[name=songs]:checked').val());
    const producerID = Number($('input[name=producers]:checked').val());

    if(_.isFinite(songID)) {
      const {songs} = this.props;
      song = _.find(songs, (s) => {
        return s.id === songID;
      });
    } else {
      errorSingle = "You must select a song";
    }
    if(_.isFinite(producerID)) {
      producer = producers[producerID];
    } else {
      errorProducer = "You must select a producer";
    }

    if(!_.isEmpty(errorProducer) || !_.isEmpty(errorSingle)) {
      let single = {
        title: song.title,
        song : songID,
        released: this.props.week,
        sales: 0,
        salesLastWeek: 0
      };
      // get id and save song
      this.props.nextWeek();
    }

    this.setState({
      errorProducer,
      errorSingle
    });

    console.log("single", song, producer);
  }

  render() {
    const {isSingle} = this.state;
    const submitValidate = isSingle ? this.validateSingle : this.validateAlbum;

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
        <div className="panel scrollable">
          <form className="centered col-10 panel-body">
            {this.renderSongList(this.props.songs)}
            <div className="divider"/>
            {this.renderProducers()}
            {this.renderProducerDetails()}
            <button
              type="button"
              className="text-center centered btn btn-lg btn-primary"
              onClick={submitValidate}
            >
              Release
            </button>
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

export default connect(mapStateToProps, {getBand, getCash, saveCash, getSongs, updateSong, nextWeek, getWeek})(Records);