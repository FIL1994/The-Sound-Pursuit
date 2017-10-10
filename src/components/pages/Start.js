/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import $ from 'jquery';
import _ from 'lodash';
import getRandomName from '../../data/names';

class Start extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      error: {
        bandName: null,
        yourName: null,
        instrument: null,
        points: null
      },
      points: 20
    };

    this.validateBandName = this.validateBandName.bind(this);
    this.validateCreate = this.validateCreate.bind(this);
    this.renderForm = this.renderForm.bind(this);
  }

  skillNames = [
    "songwriting", "musicianship", "live", "studio"
  ];

  renderSteps() {
    const {step} = this.state;

    return(
      <ul className="step">
        <li className={`step-item ${step === 0 ? 'active' : null}`}>
          <a>
            Band Name
          </a>
        </li>
        <li className={`step-item ${step === 1 ? 'active' : null}`}>
          <a>
            Create Character
          </a>
        </li>
        <li className={`step-item ${step === 2 ? 'active' : null}`}>
          <a>
            Members
          </a>
        </li>
        <li className={`step-item ${step === 3 ? 'active' : null}`}>
          <a>
            Step 4
          </a>
        </li>
      </ul>
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
            <div className={`form-group ${!_.isEmpty(error.instrument) ? 'has-error' : null}`}>
              <label className="form-label">Instrument:</label>
              <div className="centered">
                <label className="form-radio">
                  <input type="radio" name="instrument" value="vocals"/>
                    <i className="form-icon"/> Vocals
                </label>
                <label className="form-radio">
                  <input type="radio" name="instrument" value="guitar"/>
                    <i className="form-icon"/> Guitar
                </label>
                <label className="form-radio">
                  <input type="radio" name="instrument" value="bass"/>
                  <i className="form-icon"/> Bass
                </label>
                <label className="form-radio">
                  <input type="radio" name="instrument" value="drums"/>
                  <i className="form-icon"/> Drums
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
        return (
          <form className="form-horizontal">
            <h2 className="text-center">Members</h2>
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

    const bandName = $("#txtBandName").val();
    let error = _.cloneDeep(this.state.error);

    if(_.isEmpty(bandName)) {
      error.bandName = "You must enter a band name.";
    } else if(bandName.length < 2) {
      error.bandName = "Your band name must be more than one character.";
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
      step
    });
  }

  validateCreate(e) {
    e.preventDefault();

    const yourName = $('#txtYourName').val();
    const instrument = $('input[name=instrument]:checked').val();
    let error = _.cloneDeep(this.state.error);

    if(_.isEmpty(yourName)) {
      error.yourName = "You must enter a name.";
    } else if(yourName.length < 2) {
      error.yourName = "Your name must be more than one character.";
    } else {
      error.yourName = null;
    }

    if(_.isEmpty(instrument)) {
      error.instrument = "You must select an instrument";
    } else {
      error.instrument = null;
    }

    let step = this.state.step;
    if(_.isEmpty(error.yourName)) {
      step++;
      $('#txtBandName').val('');
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
          <div className="panel-header">
            <h3 className="panel-title text-center">Start</h3>
          </div>
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