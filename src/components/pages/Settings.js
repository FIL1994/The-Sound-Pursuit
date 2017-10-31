/**
 * @author Philip Van Raalte
 * @date 2017-10-24.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import localForage, {PLAY_SONG}
  from '../../data/localForage';
import SONGS from '../../data/Songs';

class Settings extends Component {
  constructor(props) {
    super(props);
    let songID = SONGS.PianoLoop.id;

    // make sure the right song is selected in the select dropdown
    if(!_.isEmpty(window.songPlaying)) {
      // if songPlaying exists and the src is not PianoLoop
      if(window.songPlaying.src !== `assets/${SONGS.PianoLoop.src}`) {
        songID = SONGS.DeepThinkerIntro.id;
      }
    } else {
      // if songPlaying was empty check again in 400ms --> songPlaying is rarely available before 400ms
      setTimeout(() => {
        // if songPlaying isn't empty and its src isn't PianoLoop set the id to DeepThinker
        if(!_.isEmpty(window.songPlaying) && window.songPlaying.src !== `assets/${SONGS.PianoLoop.src}`) {
          this.setState({songID: SONGS.DeepThinkerIntro.id});
        }
      }, 400);
    }

    this.state= {
      volume: window.VOLUME * 100 || 100,
      songID
    };

    this.songs = [
      {
        id: SONGS.PianoLoop.id,
        title: "Main Theme"
      },
      {
        id: SONGS.DeepThinkerIntro.id,
        title: "Deep Thinker"
      }
    ];

    this.volumeChange = this.volumeChange.bind(this);
    this.toggleMusic = this.toggleMusic.bind(this);
    this.changeSong = this.changeSong.bind(this);
  }

  toggleMusic() {
    const {songPlaying} = window;
    if(!songPlaying.paused && songPlaying.playState !== createjs.Sound.PLAY_SUCCEEDED) {
      window.songPlaying.play();
      localForage.setItem(PLAY_SONG, "on");
    }
    else if(songPlaying.paused){
      window.songPlaying.paused = false;
      localForage.setItem("music", "on");
    }
    else {
      window.songPlaying.stop();
      localForage.setItem("music", "off");
    }
  }

  volumeChange(event) {
    const volume = event.target.value;
    this.setState({
      volume
    });

    window.VOLUME = volume / 100;
    window.songPlaying.setVolume(volume / 100);
  }

  changeSong(event) {
    const songID = event.target.value;
    if(songID !== this.state.songID) {
      this.setState({
        songID
      });

      window.songPlaying.destroy();

      if (songID === SONGS.DeepThinkerIntro.id) {
        window.songPlaying = createjs.Sound.play(SONGS.DeepThinkerIntro.id, {volume: window.VOLUME});

        window.songPlaying.on("complete", () => {
          window.songPlaying.destroy();
          window.songPlaying = createjs.Sound.play(SONGS.DeepThinker.id, {loop: -1, volume: window.VOLUME});
        }, this);
      } else {
        window.songPlaying = createjs.Sound.play(songID, {loop: -1, volume: window.VOLUME});
      }
    }
  }

  render() {
    const {songID, volume} = this.state;

    return(
      <div className="page container centered text-center">
        <h3>Settings</h3>
        <div className="col-8 centered text-center">
          <form>
            <div className="form-group">
              <p className="form-label" htmlFor="selectSong">Select Song:</p>
              <select id="selectSong" className="form-select" value={songID} onChange={this.changeSong}>
                {
                  this.songs.map((s) => {
                    return (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    );
                  })
                }
              </select>
            </div>
            <div>
              <p className="form-label" htmlFor="rangeVolume">Volume:</p>
              <input id="rangeVolume" className="slider" type="range" min={0} max={100} value={volume}
                onChange={this.volumeChange}
              />
            </div>
            <br/>
            <div>
              <button type="button" className="btn btn-lg" onClick={this.toggleMusic}>Toggle Music</button>
            </div>
            <br/>
            <div>
              <Link to="/" className="btn btn-lg btn-primary">
                Go to Main Menu
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Settings;