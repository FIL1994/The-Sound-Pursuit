/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {getBand, getFans, getCash, getWeek, nextWeek} from '../../actions';

class Home extends Component {
  constructor(props) {
    super(props);

    this.renderMembers = this.renderMembers.bind(this);
    this.playShow = this.playShow.bind(this);
    this.practice = this.practice.bind(this);

    this.props.getBand();
    this.props.getCash();
    this.props.getFans();
    this.props.getWeek();
  }

  playShow() {

  }

  practice() {

  }

  renderMembers() {
    const {leadMember, members} = this.props.band;

    return(
      <ul>
        {
          [leadMember, ...members].map((m, index) => {
            return(
              <li key={index} className="tile">
                <div className="tile-content">
                  <strong className="tile-title">{m.name} - <span className="text-capitalize">{m.instrument}</span></strong>
                  <p className="tile-subtitle">
                    Live: {m.skills.live} |
                    Musicianship: {m.skills.musicianship} |
                    Songwriting: {m.skills.songwriting} |
                    Studio: {m.skills.studio}
                  </p>
                  <div className="col-6 centered divider"/>
                </div>
              </li>
            );
          })
        }
      </ul>
    );
  }

  render() {
    const {band} = this.props;

    return(
      <div className="page container">
        {
          _.isEmpty(band) ? null :
          <div className="text-center">
            <h3>{band.name}</h3>
            <div className="divider"/>
            <div className="centered text-center">
              <div className="btn-group btn-group-block centered col-3">
                <button type="button" className="btn btn-lg" onClick={this.playShow}>
                  Play Show
                </button>
                <button type="button" className="btn btn-lg" onClick={this.practice}>
                  Practice
                </button>
              </div>
            </div>
            <br/>
            <div>
              Fans: {this.props.fans}
            </div>
            {this.renderMembers()}
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
    week: state.week,
    cash: state.cash,
    fans: state.fans
  };
}

export default connect(mapStateToProps, {getBand, getFans, getCash, getWeek, nextWeek})(Home);