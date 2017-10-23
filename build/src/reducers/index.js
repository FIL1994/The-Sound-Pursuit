/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import {combineReducers} from 'redux';
import bandReducer from './bandReducer';
import songsReducer from './songsReducer';
import weekReducer from './weekReducer';
import cashReducer from './cashReducer';
import fansReducer from './fansReducer';
import singlesReducer from './singlesReducer';
import albumsReducer from './albumsReducer';

export default combineReducers({
  state: (state = {}) => state,
  band: bandReducer,
  songs: songsReducer,
  week: weekReducer,
  cash: cashReducer,
  fans: fansReducer,
  singles: singlesReducer,
  albums: albumsReducer
});
