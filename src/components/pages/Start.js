/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import $ from 'jquery';
import _ from 'lodash';

import INSTRUMENTS from '../../data/instruments';
import getRandomBandName from '../../data/randomBandName';
import getRandomName from '../../data/names';
import generateBandMember from '../../data/generateBandMember';
import {saveBand} from '../../actions';
import {resetDataAsync} from '../../data/resetData';

class Start extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      error: {
        bandName: null,
        yourName: null,
        instrument: null,
        points: null,
        vocals: null,
        guitar: null,
        bass: null,
        drums: null
      },
      points: 10,
      members: this.generateBandMembers(),
      bandName: null,
      yourName: null,
      instrument: null,
      skills: {
        live: 0,
        musicianship: 0,
        songwriting: 0,
        studio: 0
      }
    };

    this.validateBandName = this.validateBandName.bind(this);
    this.validateCreate = this.validateCreate.bind(this);
    this.validateBandMembers = this.validateBandMembers.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  skillNames = [
    "songwriting", "musicianship", "live", "studio"
  ];

  generateBandMembers() {
    const skillLevel = 1;

    return [
      {...generateBandMember(skillLevel), instrument: INSTRUMENTS.VOCALS}, {...generateBandMember(skillLevel), instrument: INSTRUMENTS.VOCALS}, {...generateBandMember(skillLevel), instrument: INSTRUMENTS.VOCALS},
      {...generateBandMember(skillLevel), instrument: INSTRUMENTS.GUITAR}, {...generateBandMember(skillLevel), instrument: INSTRUMENTS.GUITAR}, {...generateBandMember(skillLevel), instrument: INSTRUMENTS.GUITAR},
      {...generateBandMember(skillLevel), instrument: INSTRUMENTS.BASS}, {...generateBandMember(skillLevel), instrument: INSTRUMENTS.BASS}, {...generateBandMember(skillLevel), instrument: INSTRUMENTS.BASS},
      {...generateBandMember(skillLevel), instrument: INSTRUMENTS.DRUMS}, {...generateBandMember(skillLevel), instrument: INSTRUMENTS.DRUMS}, {...generateBandMember(skillLevel), instrument: INSTRUMENTS.DRUMS}
    ]
  }

  renderSteps() {
    const {step} = this.state;

    return(
      <ul className="step">
        <li className={`step-item ${step === 0 ? 'active' : ''}`}>
          <a>
            Enter a Band Name
          </a>
        </li>
        <li className={`step-item ${step === 1 ? 'active' : ''}`}>
          <a>
            Create Your Character
          </a>
        </li>
        <li className={`step-item ${step === 2 ? 'active' : ''}`}>
          <a>
            Select Band Members
          </a>
        </li>
      </ul>
    );
  }

  renderPopover(m) {
    return(
      <div className="popover-container">
        <div className="card">
          <div className="card-body">
            <strong>Skills</strong> <br/>
            Studio: {m.skills.studio} <br/>
            Musicianship: {m.skills.musicianship} <br/>
            Songwriting: {m.skills.songwriting} <br/>
            Live: {m.skills.live}
          </div>
        </div>
      </div>
    );
  }

  renderForm() {
    const {step, error, points, skills} = this.state;

    const renderSkills = () => {
      return this.skillNames.map((skill, index) => {
        let btnMinusProps = {}, btnPlusProps = {};
        if(skills[skill] < 1) {
          btnMinusProps.disabled = true;
          btnMinusProps.tabIndex = "-1";
        }
        if(points < 1) {
          btnPlusProps.disabled = true;
          btnPlusProps.tabIndex = "-1";
        }

        return[
          <div key={`${index}A`} className="col-6 text-left">
            <strong className="text-capitalize">{`${skill}: `}</strong>
          </div>,
          <div key={`${index}B`} className="col-6">
            <button className="btn btn-action" type="button" {...btnMinusProps}
              onClick={() => {
                if(skills[skill] > 0) {
                  let newSkills = _.cloneDeep(skills);

                  newSkills[skill]--;

                  this.setState({
                    points: points + 1,
                    skills: newSkills
                  })
                } else {
                  console.log(`ERROR - tried to minus skill (${skill}) when it was 0`);
                }
              }}
            >
              <i className="icon icon-minus"/>
            </button>
            <span className="skill-number">{skills[skill]}</span>
            <button className="btn btn-action" type="button" {...btnPlusProps}
              onClick={() => {
                if(points > 0) {
                  let newSkills = _.cloneDeep(skills);

                  newSkills[skill]++;

                  this.setState({
                    points: points - 1,
                    skills: newSkills
                  })
                } else {
                  console.log(`ERROR - tried to plus skill (${skill}) when out of points`);
                }
              }}
            >
              <i className="icon icon-plus"/>
            </button>
          </div>
        ];
      });
    };

    switch(step) {
      case 0:
        return (
          <form className="form-horizontal" onSubmit={this.validateBandName}>
            <div className="form-group">
              <div className="col-2">
                <label className="form-label" htmlFor="txtBandName">Band Name:</label>
              </div>
              <div className={`col-10 ${!_.isEmpty(error.bandName) ? 'has-error' : null}`}>
                <div className="input-group">
                  <input className="form-input input-lg" type="text" id="txtBandName" placeholder="Band Name"/>
                  <button
                    type="button"
                    className="btn btn-lg input-group-btn"
                    onClick={() => $('#txtBandName').val(getRandomBandName())}
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="is-error">{error.bandName}</p>
            </div>
            <button type="submit" className="btn btn-primary btn-lg centered">
              Next
            </button>
          </form>
        );
      case 1:
        return (
          <form className="form-horizontal" onSubmit={this.validateCreate}>
            <div className="form-group">
              <div className="col-2">
                <label className="form-label" htmlFor="txtYourName">Your Name:</label>
              </div>
              <div className={`col-10 ${!_.isEmpty(error.yourName) ? 'has-error' : null}`}>
                <div className="input-group">
                  <input className="form-input input-lg" type="text" id="txtYourName" placeholder="Your Name"/>
                  <button
                    type="button"
                    className="btn btn-lg input-group-btn"
                    onClick={() => $('#txtYourName').val(getRandomName())}
                  >
                    Random
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="is-error">{error.yourName}</p>
            </div>
            <div className={`form-group ${!_.isEmpty(error.instrument) ? 'has-error' : ''}`}>
              <label className="form-label">Instrument:</label>
              <div className="centered">
                <label className="form-radio text-capitalize">
                  <input type="radio" name="instrument" value={INSTRUMENTS.VOCALS}/>
                    <i className="form-icon"/> {INSTRUMENTS.VOCALS}
                </label>
                <label className="form-radio text-capitalize">
                  <input type="radio" name="instrument" value={INSTRUMENTS.GUITAR}/>
                    <i className="form-icon"/> {INSTRUMENTS.GUITAR}
                </label>
                <label className="form-radio text-capitalize">
                  <input type="radio" name="instrument" value={INSTRUMENTS.BASS}/>
                  <i className="form-icon"/> {INSTRUMENTS.BASS}
                </label>
                <label className="form-radio text-capitalize">
                  <input type="radio" name="instrument" value={INSTRUMENTS.DRUMS}/>
                  <i className="form-icon"/> {INSTRUMENTS.DRUMS}
                </label>
              </div>
            </div>
            <div className="text-center">
              <p className="is-error">{error.instrument}</p>
            </div>
            <div className="text-center centered">
              <h5>Points: {points}</h5>
              <div className="col-8 centered">
                <div className="divider"/>
              </div>
              <div className="col-6 centered">
                <div className="columns">
                  {renderSkills()}
                </div>
              </div>
              <p className="is-error">{error.points}</p>
            </div>
            <br/>
            <button type="submit" className="btn btn-primary btn-lg centered">
              Next
            </button>
          </form>
        );
      case 2:
        const {instrument, members} = this.state;
        const vocalists = members.filter((m) => {return m.instrument === INSTRUMENTS.VOCALS});
        const guitarists = members.filter((m) => {return m.instrument === INSTRUMENTS.GUITAR});
        const bassists = members.filter((m) => {return m.instrument === INSTRUMENTS.BASS});
        const drummers = members.filter((m) => {return m.instrument === INSTRUMENTS.DRUMS});

        const popoverClass = "popover popover-top col-3";

        const radioVocals = <div>
          <div className={`form-group columns ${!_.isEmpty(error.vocals) ? 'has-error' : ''}`}>
            <label className="form-label col-3"><strong>Vocals: </strong></label>
            {
              vocalists.map((m, index) => {
                return (
                  <div className={popoverClass} key={`vocals-${index}`}>
                    <label className="form-radio">
                      <input type="radio" value={JSON.stringify(m)} name={INSTRUMENTS.VOCALS}/>
                      <i className="form-icon"/> {m.name}
                    </label>
                    {this.renderPopover(m)}
                  </div>
                );
              })
            }
          </div>
          <div className="text-center">
            <p className="is-error">{error.vocals}</p>
          </div>
        </div>;

        const radioGuitar = <div>
          <div className={`form-group columns ${!_.isEmpty(error.guitar) ? 'has-error' : ''}`}>
            <label className="form-label col-3"><strong>Guitar: </strong></label>
            {
              guitarists.map((m, index) => {
                return (
                  <div className={popoverClass} key={`guitar-${index}`}>
                    <label className="form-radio">
                      <input type="radio" value={JSON.stringify(m)} name={INSTRUMENTS.GUITAR}/>
                      <i className="form-icon"/> {m.name}
                    </label>
                    {this.renderPopover(m)}
                  </div>
                );
              })
            }
          </div>
          <div className="text-center">
            <p className="is-error">{error.guitar}</p>
          </div>
        </div>;

        const radioBass = <div>
          <div className={`form-group columns ${!_.isEmpty(error.bass) ? 'has-error' : ''}`}>
            <label className="form-label col-3"><strong>Bass: </strong></label>
            {
              bassists.map((m, index) => {
                return (
                  <div className={popoverClass} key={`bass-${index}`}>
                    <label className="form-radio">
                      <input type="radio" value={JSON.stringify(m)} name={INSTRUMENTS.BASS}/>
                      <i className="form-icon"/> {m.name}
                    </label>
                    {this.renderPopover(m)}
                  </div>
                );
              })
            }
          </div>
          <div className="text-center">
            <p className="is-error">{error.bass}</p>
          </div>
        </div>;

        const radioDrums = <div>
          <div className={`form-group columns ${!_.isEmpty(error.drums) ? 'has-error' : ''}`}>
            <label className="form-label col-3"><strong>Drums: </strong></label>
            {
              drummers.map((m, index) => {
                return (
                  <div className={popoverClass} key={`drums-${index}`}>
                    <label className="form-radio">
                      <input type="radio" value={JSON.stringify(m)} name={INSTRUMENTS.DRUMS}/>
                      <i className="form-icon"/> {m.name}
                    </label>
                    {this.renderPopover(m)}
                  </div>
                );
              })
            }
          </div>
          <div className="text-center">
            <p className="is-error">{error.drums}</p>
          </div>
        </div>;

        return (
          <form className="form-horizontal" onSubmit={this.validateBandMembers}>
            <div className="centered col-8">
              {instrument === INSTRUMENTS.VOCALS ? null : radioVocals}
              {instrument === INSTRUMENTS.GUITAR ? null : radioGuitar}
              {instrument === INSTRUMENTS.BASS ? null : radioBass}
              {instrument === INSTRUMENTS.DRUMS ? null : radioDrums}
            </div>
            <br/>
            <button type="submit" className="btn btn-primary btn-lg centered">
              Next
            </button>
          </form>
        );
    }
  }

  validateBandName(e) {
    e.preventDefault();

    let bandName = $("#txtBandName").val();
    let error = _.cloneDeep(this.state.error);

    if(_.isEmpty(bandName)) {
      error.bandName = "You must enter a band name.";
      bandName = null;
    } else if(bandName.length < 2) {
      error.bandName = "Your band name must be more than one character.";
      bandName = null;
    } else {
      error.bandName = null;
    }

    let step = this.state.step;
    if(_.isEmpty(error.bandName)) {
      step++;
      $('#txtBandName').val('');
    }

    this.setState({
      error,
      step,
      bandName
    });
  }

  validateCreate(e) {
    e.preventDefault();

    let {points} = this.state;
    let yourName = $('#txtYourName').val();
    let instrument = $('input[name=instrument]:checked').val();
    let error = _.cloneDeep(this.state.error);

    if(_.isEmpty(yourName)) {
      error.yourName = "You must enter a name.";
      yourName = null;
    } else if(yourName.length < 2) {
      error.yourName = "Your name must be more than one character.";
      yourName = null;
    } else {
      error.yourName = null;
    }

    if(_.isEmpty(instrument)) {
      error.instrument = "You must select an instrument";
      instrument = null;
    } else {
      error.instrument = null;
    }

    if(points > 0) {
      error.points = "You must spend all of your points";
    } else {
      error.points = null;
    }

    let step = _.cloneDeep(this.state.step);
    if(_.isEmpty(error.yourName) && _.isEmpty(error.instrument) && _.isEmpty(error.points)) {
      step++;
      $('#txtBandName').val('');
    }

    this.setState({
      error,
      step,
      yourName,
      instrument
    });
  }

  validateBandMembers(e) {
    e.preventDefault();
    const {yourName, instrument, skills} = this.state;
    let error = _.cloneDeep(this.state.error);

    error.vocals = null; error.guitar = null; error.bass = null; error.drums = null;

    let vocals = $(`input[name=${INSTRUMENTS.VOCALS}]:checked`).val();
    let guitar = $(`input[name=${INSTRUMENTS.GUITAR}]:checked`).val();
    let bass = $(`input[name=${INSTRUMENTS.BASS}]:checked`).val();
    let drums = $(`input[name=${INSTRUMENTS.DRUMS}]:checked`).val();

    if(instrument === INSTRUMENTS.VOCALS) {
      vocals = {name: yourName, instrument, skills};
    } else if(instrument === INSTRUMENTS.GUITAR) {
      guitar = {name: yourName, instrument, skills};
    } else if(instrument === INSTRUMENTS.BASS) {
      bass = {name: yourName, instrument, skills};
    } else if(instrument === INSTRUMENTS.DRUMS) {
      drums = {name: yourName, instrument, skills};
    }

    if(_.isEmpty(vocals)) {
      error.vocals = "You must select a vocalist";
    }
    if(_.isEmpty(guitar)) {
      error.guitar = "You must select a guitarist";
    }
    if(_.isEmpty(bass)) {
      error.bass = "You must select a bassist";
    }
    if(_.isEmpty(drums)) {
      error.drums = "You must select a drummer";
    }

    let step = _.cloneDeep(this.state.step);
    if(_.isEmpty(error.vocals) && _.isEmpty(error.guitar) && _.isEmpty(error.bass) && _.isEmpty(error.drums)) {
      let members = [], leadMember = {};

      if(instrument !== INSTRUMENTS.VOCALS) {
        try {
          vocals = JSON.parse(vocals);
          members.push(vocals);
        } catch(e){}
      } else {
        leadMember = vocals;
      }
      if(instrument !== INSTRUMENTS.GUITAR) {
        try {
          guitar = JSON.parse(guitar);
          members.push(guitar);
        } catch(e){}
      } else {
        leadMember = guitar;
      }
      if(instrument !== INSTRUMENTS.BASS) {
        try {
          bass = JSON.parse(bass);
          members.push(bass);
        } catch(e){}
      } else {
        leadMember = bass;
      }
      if(instrument !== INSTRUMENTS.DRUMS) {
        try {
          drums = JSON.parse(drums);
          members.push(drums);
        } catch(e){}
      } else {
        leadMember = drums;
      }

      resetDataAsync().then(() => {
        this.props.saveBand({
          name: this.state.bandName,
          members,
          leadMember,
          practices: 0,
          practicesToLevelUp: 1,
          totalPractices: 0
        }).then(() => {
          this.props.history.push('/dashboard');
        });
      });
    }

    this.setState({
      error,
      step
    });
  }

  render() {
    return(
      <div className="page container">
        <div className="panel">
          <div className="centered col-10 panel-body">
            {this.renderSteps()}
            <div className="divider"/>
            <br/>
            {this.renderForm()}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, {saveBand})(Start));