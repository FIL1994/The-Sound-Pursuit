/**
 * @author Philip Van Raalte
 * @date 2017-10-19.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import {getBand} from '../../actions';
import {resetDataAsync} from '../../data/resetData';

class MainMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resettingData: false,
      showToastDeleted: false
    };

    this.resetData = this.resetData.bind(this);
  }

  componentWillMount() {
    this.props.getBand();
  }

  resetData() {
    this.setState({resettingData: true});
    resetDataAsync().then(() => {
      this.props.getBand();
      this.setState({resettingData: false, showToastDeleted: true});
      setTimeout(() => {
          this.setState({
            showToastDeleted: false
          });
        },
        3000
      );
    });
  }

  render() {
    const {resettingData, showToastDeleted} = this.state;

    const disabledButtonProps = _.isEmpty(this.props.band)
      ?
        {
          disabled: true,
          tabIndex: "-1"
        }
      :
        {};

    const resetProps = !resettingData
      ?
        {
          className: "btn btn-lg btn-primary"
        }
      :
        {
          className: "btn btn-lg btn-primary loading"
        };

    return(
      <div className="page container centered text-center">
        <h2>Main Menu</h2>
        <div className="divider"/>
        <div className="spaced">
          <div className="btn-group btn-group-block centered col-8">
            <Link
              to="/dashboard"
              className="btn btn-lg btn-primary"
              {...disabledButtonProps}
            >
              Continue
            </Link>
          </div>
          <div className="btn-group btn-group-block centered col-8">
            <Link to="/start" className="btn btn-lg btn-primary">
              Start
            </Link>
          </div>
          <div className="btn-group btn-group-block centered col-8">
            <button type="button" {...resetProps} onClick={this.resetData}>
              Delete Save
            </button>
          </div>
        </div>
        {
          showToastDeleted
            ?
              <div className="toast toast-bottom">
                Save deleted
              </div>
            :
              ''
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

export default connect(mapStateToProps, {getBand})(MainMenu);