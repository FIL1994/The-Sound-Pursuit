/**
 * @author Philip Van Raalte
 * @date 2017-10-24.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state= {
      volume: 100,
      song: 1
    };
  }

  render() {
    const {song, volume} = this.state;

    return(
      <div className="page container centered text-center">
        <h3>Settings</h3>
        <div className="col-8 centered text-center">
          <form>
            <div className="form-group">
              <p className="form-label" htmlFor="selectSong">Select Song:</p>
              <select id="selectSong" className="form-select" value={song}
                onChange={
                  (e) => {
                    this.setState({
                      song: e.target.value
                    });
                  }
                }
              >
                <option value={1}>Song 1</option>
                <option value={2}>Song 2</option>
                <option value={3}>Song 3</option>
              </select>
            </div>
            <div>
              <p className="form-label" htmlFor="rangeVolume">Volume:</p>
              <input id="rangeVolume" className="slider" type="range" min={0} max={100} value={volume}
                onChange={
                  (e) => {
                    this.setState({
                      volume: e.target.value
                    });
                  }
                }
              />
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