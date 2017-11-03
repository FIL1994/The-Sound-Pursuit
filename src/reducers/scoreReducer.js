import {GET_SCORE, SET_SCORE} from '../actions/types';

export default function (state = {}, action) {
  switch(action.type) {
    case SET_SCORE:
      return action.payload;
    case GET_SCORE:
      return state;
    default:
      return state;
  }
}