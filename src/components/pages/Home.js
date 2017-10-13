/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import {getBand} from '../../actions/index';

class Home extends Component {
  constructor(props) {
    super(props);

    this.renderMembers = this.renderMembers.bind(this);

    this.props.getBand();
  }

  renderMembers() {
    let {leadMember, members} = this.props.band;
    members.unshift(leadMember);

    return(
      <ul>
        {
          members.map((m, index) => {
            return(
              <li key={index} className="tile">
                <div className="tile-content">
                  <strong className="tile-title">{m.name} - <span className="text-capitalize">{m.instrument}</span></strong>
                  <p className="tile-subtitle">
                    Live: {m.skills.live} |
                    Musicianship: {m.skills.musicianship} |
                    Studio: {m.skills.studio} |
                    Songwriting: {m.skills.songwriting}
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
    // console.log("Home - DATA_BAND", band);

    return(
      <div className="page container">
        {
          _.isEmpty(band) ? null :
          <div className="text-center">
            <h3>{band.name}</h3>
            <div className="divider"/>
            <div className="centered text-center">
              <button type="button" className="btn">
                Play Show
              </button>
              <button type="button" className="btn">
                Practice
              </button>
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
    band: state.band
  };
}

export default connect(mapStateToProps, {getBand})(Home);