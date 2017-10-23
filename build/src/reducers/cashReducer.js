/**
 * @author Philip Van Raalte
 * @date 2017-10-13.
 */
import {GET_CASH, SAVE_CASH, ERROR_CASH} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case SAVE_CASH:
      return action.payload;
    case GET_CASH:
      return action.payload;
    case ERROR_CASH:
      console.log("DATA_CASH ERROR", action.error);
      return state;
    default:
      return state;
  }
}