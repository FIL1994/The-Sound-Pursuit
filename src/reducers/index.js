/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import {combineReducers} from 'redux';
import bandReducer from './bandReducer';

export default combineReducers({
  state: (state = {}) => state,
  band: bandReducer
});