/**
 * @author Philip Van Raalte
 * @date 2017-10-17.
 */
import {GET_SINGLES, SAVE_SINGLES, ERROR_SINGLES} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case SAVE_SINGLES:
      return action.payload;
    case GET_SINGLES:
      return action.payload;
    case ERROR_SINGLES:
      console.log("DATA_SINGLES ERROR", action.error);
      return state;
    default:
      return state;
  }
}