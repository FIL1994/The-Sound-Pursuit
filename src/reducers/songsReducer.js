/**
 * @author Philip Van Raalte
 * @date 2017-10-11.
 */
import {SAVE_SONGS, DELETE_SONG, ERROR_SONG, GET_SONGS} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_SONGS:
      return action.payload;
    case SAVE_SONGS:
      return action.payload;
    case DELETE_SONG:
      return action.payload;
    case ERROR_SONG:
      console.log("SONG ERROR", action.error);
      return state;
    default:
      return state;
  }
}