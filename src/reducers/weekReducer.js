/**
 * @author Philip Van Raalte
 * @date 2017-10-13.
 */
import {GET_WEEK, SAVE_WEEK, ERROR_WEEK} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case SAVE_WEEK:
      return action.payload;
    case GET_WEEK:
      return action.payload;
    case ERROR_WEEK:
      console.log("DATA_WEEK ERROR", action.error);
      return state;
    default:
      return state;
  }
}