/**
 * @author Philip Van Raalte
 * @date 2017-10-07.
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import _ from 'lodash';
import localForage, {BAND} from '../data/localForage';

class HasStarted extends Component {
  constructor(props) {
    super(props);

    localForage.getItem(BAND, (err, value) => {
      if(err){
        console.log("Local Forage Error", err);
      }
      else if(_.isEmpty(value)) {
        this.props.history.push('/start');
      }
      else {}
    });
  }

  render() {
    return null;
  }
}

export default withRouter(HasStarted);