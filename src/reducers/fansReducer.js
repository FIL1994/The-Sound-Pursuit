/**
 * @author Philip Van Raalte
 * @date 2017-10-13.
 */
import {GET_FANS, SAVE_FANS, ERROR_FANS} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case SAVE_FANS:
      return action.payload;
    case GET_FANS:
      return action.payload;
    case ERROR_FANS:
      console.log("DATA_FANS ERROR", action.error);
      return state;
    default:
      return state;
  }
}