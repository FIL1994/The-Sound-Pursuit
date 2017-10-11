/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import {CREATE_BAND, GET_BAND, ERROR_BAND} from './types';
import localForage, {BAND} from '../data/localForage';

export function createBand(band) {
  // console.log("ACTION - createBand: ", band);

  return dispatch => {
    console.log("dispatching", dispatch);

    return localForage.setItem(BAND, band).then(
      (val, err) => {
        if(err) {
          dispatch(saveBandError(err));
        } else {
          dispatch(saveBand(val));
        }
      }
    );
  };

  function saveBand(val) {
    return {
      type: CREATE_BAND,
      payload: val
    };
  }

  function saveBandError (error) {
    return {
      type: ERROR_BAND,
      error
    };
  }
}

export function getBand() {
  return dispatch => {
    return localForage.getItem(BAND).then(
      (val, err) => {
        if(err) {
          dispatch(getBandError(err))
        } else {
          dispatch(getBandSuccess(val))
        }
      }
    );
  };

  function getBandSuccess(val) {
    return {
      type: GET_BAND,
      payload: val
    };
  }

  function getBandError (error) {
    return {
      type: ERROR_BAND,
      error
    };
  }
}