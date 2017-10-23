/**
 * @author Philip Van Raalte
 * @date 2017-10-17.
 */
import {GET_ALBUMS, SAVE_ALBUMS, ERROR_ALBUMS} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case SAVE_ALBUMS:
      return action.payload;
    case GET_ALBUMS:
      return action.payload;
    case ERROR_ALBUMS:
      console.log("DATA_ALBUMS ERROR", action.error);
      return state;
    default:
      return state;
  }
}