/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import {CREATE_BAND, GET_BAND, ERROR_BAND} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case CREATE_BAND:
      return action.payload;
    case GET_BAND:
      return action.payload;
    case ERROR_BAND:
      console.log("DATA_BAND ERROR", action.error);
      return state;
    default:
      return state;
  }
}