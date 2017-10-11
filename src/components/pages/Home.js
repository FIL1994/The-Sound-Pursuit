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
      <div>
        <ul>
          {
            members.map((m, index) => {
              return(
                <li key={index}>
                  {m.name} - {m.instrument}
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }

  render() {
    const {band} = this.props;
    // console.log("Home - BAND", band);

    return(
      <div className="page container">
        {
          _.isEmpty(band) ? null :
          <div>
            <h3 className="text-center">{band.name}</h3>
            <Link to="/members">
            Members
            </Link>
            <div className="divider"/>
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