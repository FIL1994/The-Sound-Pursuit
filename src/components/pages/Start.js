/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import $ from 'jquery';
import _ from 'lodash';
import INSTRUMENTS from '../../data/instruments';
import getRandomName from '../../data/names';
import generateBandMember from '../../data/generateBandMember';

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
      instrument: null
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
    const {step, error, points} = this.state;

    const renderSkills = () => {
      return this.skillNames.map((skill, index) => {
          return[
            <div key={`${index}A`} className="col-6 text-left">
              <strong className="text-capitalize">{`${skill}: `}</strong>
            </div>,
            <div key={`${index}B`} className="col-6">
              <button className="btn btn-action" type="button" disabled tabIndex="-1">
                <i className="icon icon-minus"/>
              </button>
              {` 0 `}
              <button className="btn btn-action" type="button">
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
            <h4 className="text-center">Enter a Band Name</h4>
            <br/>
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
                    onClick={() => $('#txtBandName').val(getRandomName)}
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
            <h4 className="text-center">Create Your Character</h4>
            <br/>
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
                    onClick={() => $('#txtYourName').val(getRandomName)}
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

        const radioVocals = <div className={`form-group columns ${!_.isEmpty(error.vocals) ? 'has-error' : ''}`}>
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
          <div className="text-center">
            <p className="is-error">{error.vocals}</p>
          </div>
        </div>;

        const radioGuitar = <div className={`form-group columns ${!_.isEmpty(error.guitar) ? 'has-error' : ''}`}>
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
          <div className="text-center">
            <p className="is-error">{error.guitar}</p>
          </div>
        </div>;

        const radioBass = <div className={`form-group columns ${!_.isEmpty(error.bass) ? 'has-error' : ''}`}>
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
          <div className="text-center">
            <p className="is-error">{error.bass}</p>
          </div>
        </div>;

        const radioDrums = <div className={`form-group columns ${!_.isEmpty(error.drums) ? 'has-error' : ''}`}>
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
          <div className="text-center">
            <p className="is-error">{error.drums}</p>
          </div>
        </div>;

        return (
          <form className="form-horizontal" onSubmit={this.validateBandMembers}>
            <h4 className="text-center">Select Band Members</h4>
            <br/>
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

    let step = this.state.step;
    if(_.isEmpty(error.yourName) && _.isEmpty(error.instrument)) {
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
    const {instrument} = this.state;
    let error = _.cloneDeep(this.state.error);

    error.vocals = null; error.guitar = null; error.bass = null; error.drums = null;

    let vocals = $(`input[name=${INSTRUMENTS.VOCALS}]:checked`).val();
    let guitar = $(`input[name=${INSTRUMENTS.GUITAR}]:checked`).val();
    let bass = $(`input[name=${INSTRUMENTS.BASS}]:checked`).val();
    let drums = $(`input[name=${INSTRUMENTS.DRUMS}]:checked`).val();

    if(instrument === INSTRUMENTS.VOCALS) {
      vocals = {name: this.state.yourName, instrument};
    } else if(instrument === INSTRUMENTS.GUITAR) {
      guitar = {name: this.state.yourName, instrument};
    } else if(instrument === INSTRUMENTS.BASS) {
      bass = {name: this.state.yourName, instrument};
    } else if(instrument === INSTRUMENTS.DRUMS) {
      drums = {name: this.state.yourName, instrument};
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

    if(_.isEmpty(error.vocals) && _.isEmpty(error.guitar) && _.isEmpty(error.bass) && _.isEmpty(error.drums)) {
      try { vocals = JSON.parse(vocals); } catch(e){}
      try { guitar = JSON.parse(guitar); } catch(e){}
      try { bass = JSON.parse(bass); } catch(e){}
      try { drums = JSON.parse(drums); } catch(e){}
    }

    console.log(vocals, guitar, bass, drums, instrument, error);
  }

  render() {
    // const {bandName} = this.state;

    return(
      <div className="page container">
        <div className="panel">
          {/*<div className="panel-header">*/}
            {/*<h2 className="panel-title text-center">Start {bandName !== null ? ` - ${bandName}` : null}</h2>*/}
          {/*</div>*/}
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

export default Start;