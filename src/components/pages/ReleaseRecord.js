/**
 * @author Philip Van Raalte
 * @date 2017-10-16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import $ from 'jquery';
import _ from 'lodash';
import {getBand, getCash, saveCash, getSongs, updateSong, saveSongs, getSingles, addSingle, getAlbums, addAlbum,
  removeCash, nextWeek, getWeek} from '../../actions';
import getRandomSongName from '../../data/randomSongName';
import producers from '../../data/producers';

class ReleaseRecord extends Component {
  constructor(props) {
    super(props);

    this.renderSongList = this.renderSongList.bind(this);
    this.renderProducers = this.renderProducers.bind(this);
    this.renderProducerDetails = this.renderProducerDetails.bind(this);
    this.validateAlbum = this.validateAlbum.bind(this);
    this.validateSingle = this.validateSingle.bind(this);
    this.changedProducer = this.changedProducer.bind(this);
    this.checkEnoughCash = this.checkEnoughCash.bind(this);

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
    this.props.getSingles();
    this.props.getAlbums();
    this.props.getSongs();
    this.props.getCash();
    this.props.getWeek();
  }

  checkEnoughCash(cost) {
    return cost <= this.props.cash;
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
            <div id="albums-song-select">
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

  changedProducer(isSingle) {
    let producerID = $('input[name=producers]:checked').val();
    producerID = Number(producerID);
    isSingle = _.isBoolean(isSingle) ? isSingle : this.state.isSingle;

    if(_.isFinite(producerID)) {
      let errorProducer = null;
      const {name, cost: {single, album}} = producers[producerID];
      const hasEnoughCash = this.checkEnoughCash(isSingle ? single : album);
      if(!hasEnoughCash) {
        errorProducer = `You don't have enough cash to hire ${name}`;
      }

      if(this.state.producerID !== producerID || errorProducer !== this.state.errorProducer) {
        this.setState({
          producerID,
          errorProducer
        })
      }
    }
  }

  validateAlbum() {
    let errorProducer = null, errorAlbum = null, producer, checkboxes = [], cost;
    // album title
    let albumTitle = $('#txtAlbumTitle').val();
    if(_.isEmpty(albumTitle)) {
      albumTitle = getRandomSongName();
    }

    // song select
    $("#albums-song-select").find("input:checked").each(function() {
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
      cost = producer.cost.album;

      // enough cash check
      if(!this.checkEnoughCash(cost)) {
        errorProducer = `You don't have enough cash to hire ${producer.name}`;
      }
    } else {
      errorProducer = "You must select a producer";
    }

    // if no errors
    if(_.isEmpty(errorProducer) && _.isEmpty(errorAlbum)) {
      // calculate quality
      const {songs} = this.props;

      let sumQuality = 0, avgQuality, quality;
      checkboxes.forEach((s) => {
        const song = _.find(songs, {'id': s});
        sumQuality += ((song.quality * 3) + (song.recording * 2)) / 5;
      });
      avgQuality = sumQuality / checkboxes.length;
      quality = ((avgQuality * 5) + producer.quality) / 6;
      quality = Number(quality.toFixed(2));

      let album = {
        title: albumTitle,
        songs: checkboxes,
        released: this.props.week,
        quality,
        sales: 0,
        salesLastWeek: 0
      };
      // get album id and save songs
      this.props.addAlbum(album).then(() => {
        this.props.getAlbums().then(() => {
          const {albums, songs} = this.props;
          const album = _.maxBy(albums, 'released');

          album.songs.forEach((s) => {
            const songIndex = _.findIndex(songs, {'id': s});
            let song = songs[songIndex];
            song.album = album.id;
          });

          this.props.saveSongs(songs).then(() => {
            this.props.getSongs();
          });
        });
      });

      this.changedProducer(false); // isSingle = false
      this.props.removeCash(cost);
      this.props.nextWeek();
    }

    this.setState({
      errorProducer,
      errorAlbum
    });
  }

  validateSingle() {
    let errorProducer = null, errorSingle = null, song, producer, cost;
    const songID = Number($('input[name=songs]:checked').val());
    const producerID = Number($('input[name=producers]:checked').val());

    // get song
    if(_.isFinite(songID)) {
      const {songs} = this.props;
      song = _.find(songs, (s) => {
        return s.id === songID;
      });
    } else {
      errorSingle = "You must select a song";
    }
    // get producer
    if(_.isFinite(producerID)) {
      producer = producers[producerID];
      cost = producer.cost.single;

      // enough cash check
      if(!this.checkEnoughCash(cost)) {
        errorProducer = `You do not have enough money to hire ${producer.name}`;
      }
    } else {
      errorProducer = "You must select a producer";
    }

    // if no errors
    if(_.isEmpty(errorProducer) && _.isEmpty(errorSingle)) {
      // calculate quality
      let quality = ((song.quality * 3) + (song.recording * 2) + producer.quality) / 6;
      quality = Number(quality.toFixed(2));

      let single = {
        title: song.title,
        song : songID,
        released: this.props.week,
        quality,
        sales: 0,
        salesLastWeek: 0
      };
      // get id and save song
      this.props.addSingle(single).then(() => {
        this.props.getSingles().then(() => {
          const {singles, songs} = this.props;
          const single = _.maxBy(singles, 'released');
          let song = _.find(songs, {'id': single.song});
          song.single = single.id;
          this.props.updateSong(song);
        });
      });

      this.changedProducer(true); // isSingle = true
      this.props.removeCash(cost);
      this.props.nextWeek();
    }

    this.setState({
      errorProducer,
      errorSingle
    });
  }

  render() {
    const {isSingle} = this.state;
    const submitValidate = isSingle ? this.validateSingle : this.validateAlbum;

    return (
      <div className="page container" id="page-records">
        <ul className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/records/">Records</Link>
          </li>
          <li className="breadcrumb-item">
            Release
          </li>
        </ul>
        <div className="centered text-center">
          <div className="btn-group btn-group-block centered col-4">
            <button type="button" className={`btn btn-lg ${isSingle ? 'btn-primary' : ''}`}
              onClick={() => {this.changedProducer(true); this.setState({isSingle: true});}}
            >
              Single
            </button>
            <button type="button" className={`btn btn-lg ${isSingle ? '' : 'btn-primary'}`}
              onClick={() => {this.changedProducer(false); this.setState({isSingle: false})}}
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
    cash: state.cash,
    albums: state.albums,
    singles: state.singles,
    week: state.week
  };
}

export default connect(mapStateToProps, {getBand, getCash, saveCash, removeCash, getSongs, updateSong, getSingles,
  addSingle, getAlbums, addAlbum, nextWeek, getWeek, saveSongs})(ReleaseRecord);