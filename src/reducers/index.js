/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import {combineReducers} from 'redux';
import bandReducer from './bandReducer';
import songsReducer from './songsReducer';

export default combineReducers({
  state: (state = {}) => state,
  band: bandReducer,
  songs: songsReducer
});