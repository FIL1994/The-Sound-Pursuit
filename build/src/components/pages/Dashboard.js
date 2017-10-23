/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {getBand, saveBand, getFans, addFans, getCash, addCash, getWeek, nextWeek} from '../../actions';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.renderMembers = this.renderMembers.bind(this);
    this.playShow = this.playShow.bind(this);
    this.practice = this.practice.bind(this);

    this.state = {
      showShow: false,
      newFans: null,
      newCash: null,
      showPractice: false,
      practiceToast: null,
      lastPractice: 0,
      lastShow: 0
    };
  }

  componentWillMount() {
    this.props.getBand();
    this.props.getCash();
    this.props.getFans();
    this.props.getWeek();
  }

  playShow() {
    const {leadMember, members: m} = this.props.band;
    const members = [leadMember, ...m];

    let maxSkill = 0, sumSkill = 0, avgSkill;

    members.forEach(({skills: {live, musicianship}}) => {
      const skill = (live * 3) + musicianship;
      if(skill > maxSkill) {
        maxSkill = skill;
      }
      sumSkill += skill;
    });
    avgSkill = sumSkill / members.length;

    const performance = Number((_.random(avgSkill, maxSkill) * _.random(0.8, 1.2)).toFixed(2));

    const newFans = _.ceil(performance * 0.75);
    const newCash = Number((performance * 1.05).toFixed(2));
    this.props.addFans(newFans);
    this.props.addCash(newCash);
    this.props.nextWeek();

    const lastShow = Date.now() / 1000;

    this.setState({
      showShow: true,
      newFans,
      newCash,
      lastShow
    });

    setTimeout(() => {
      const now = Date.now() / 1000;
      if(now > this.state.lastShow + 2.9) {
        this.setState({
          showShow: false,
          newFans: null,
          newCash: null,
          lastShow: Date.now() / 1000
        });
      }
    }, 3000);
  }

  practice() {
    let {leadMember, members, practices, practicesToLevelUp, totalPractices} = this.props.band;
    const prevPracticesToLevelUp = _.clone(practicesToLevelUp);
    let practiceToast, timesLeveledUp = 0;

    practices += 3;
    totalPractices += practices;
    while(practices >= practicesToLevelUp) {
      timesLeveledUp++;
      practices = practices - practicesToLevelUp;
      practicesToLevelUp = _.ceil(totalPractices/25);
      // increment value but only allow a maximum of 100
      function incrementMax100(val) {
        return _.min([val + 1, 100]);
      }
      // Increase members' and lead member's skills
      members = members.map((m) => {
        let {skills: {live, musicianship, songwriting, studio}} = m;

        live = incrementMax100(live);
        musicianship = incrementMax100(musicianship);
        songwriting = incrementMax100(songwriting);
        studio = incrementMax100(studio);

        return {...m, skills: {live, musicianship, songwriting, studio}};
      });
      leadMember.skills.live = incrementMax100(leadMember.skills.live);
      leadMember.skills.musicianship = incrementMax100(leadMember.skills.musicianship);
      leadMember.skills.songwriting = incrementMax100(leadMember.skills.songwriting);
      leadMember.skills.studio = incrementMax100(leadMember.skills.studio);
    }

    const progress = _.ceil((practices / practicesToLevelUp) * 100);
    window.practices = practices;
    window.practicesToLevelUp = practicesToLevelUp;
    window.prevPracticesToLevelUp = prevPracticesToLevelUp;
    if(timesLeveledUp > 0) {
      practiceToast = <span>Leveled Up!{timesLeveledUp > 1 ? ` (x${timesLeveledUp})` : ''}</span>;
    } else {
      practiceToast = <progress
        className="progress"
        value={progress}
        max="100"
      />;
    }

    this.props.saveBand({...this.props.band, leadMember, members, practices, practicesToLevelUp, totalPractices});
    this.props.nextWeek();

    const lastPractice = Date.now() / 1000;

    this.setState({
      showPractice: true,
      practiceToast,
      lastPractice
    });

    // in 3 seconds (from the last practice) hide practice toast
    setTimeout(() => {
      const now = Date.now() / 1000;
      if(now > this.state.lastPractice + 2.9) {
        this.setState({
          showPractice: false,
          practiceToast: null,
          lastPractice: Date.now() / 1000
        });
      }
    }, 3000);
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
    const {showShow, showPractice, newFans, newCash, practiceToast} = this.state;

    return(
      <div className="page container">
        {
          _.isEmpty(band) ? null :
          <div className="text-center">
            <h3>{band.name}</h3>
            <div className="divider"/>
            <div className="centered text-center">
              <div className="btn-group btn-group-block centered col-2">
                <button type="button" className="btn btn-lg" onClick={this.playShow}>
                  Play Show
                </button>
                <button type="button" className="btn btn-lg" onClick={this.practice}>
                  Practice
                </button>
              </div>
              <div className="centered col-3">
                {
                  !showShow ? null :
                  <div className="toast centered text-center">
                    <span>New Fans: {newFans}<br/>Cash: ${newCash}</span>
                  </div>
                }
                {
                  !showPractice ? null :
                    <div className="toast">
                      {practiceToast}
                    </div>
                }
              </div>
            </div>
            <br/>
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

export default connect(mapStateToProps, {getBand, saveBand, getFans, getCash, getWeek, addFans, addCash,
  nextWeek})(Dashboard);