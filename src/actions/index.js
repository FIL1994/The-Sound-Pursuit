/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import _ from 'lodash';
import {CREATE_BAND, GET_BAND, ERROR_BAND, GET_SONGS, ERROR_SONG, SAVE_SONGS, DELETE_SONG, UPDATE_SONG} from './types';
import localForage, {DATA_BAND, DATA_SONGS} from '../data/localForage';

function sendReturn({type, payload, error}) {
  return {
    type,
    payload,
    error
  }
}

// START BAND
export function createBand(band) {
  return dispatch => {
    return localForage.setItem(DATA_BAND, band).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_BAND, error}));
        } else {
          dispatch(sendReturn({type: CREATE_BAND, payload: val}));
        }
      }
    );
  };
}

export function getBand() {
  return dispatch => {
    return localForage.getItem(DATA_BAND).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_BAND, error}));
        } else {
          dispatch(sendReturn({type: GET_BAND, payload: val}));
        }
      }
    );
  };
}
// END BAND

// START SONGS
export function getSongs() {
  return dispatch => {
    return localForage.getItem(DATA_SONGS).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        } else {
          dispatch(sendReturn({type: GET_SONGS, payload: val}));
        }
      }
    );
  };
}

export function saveSongs(songs) {
  return dispatch => {
    return localForage.setItem(DATA_SONGS, songs).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        } else {
          dispatch(sendReturn({type: SAVE_SONGS, payload: val}));
        }
      }
    );
  };
}

export function writeSong(song) {
  return dispatch => {
    return localForage.getItem(DATA_SONGS).then(
      (songs, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        } else {
          if(_.isEmpty(songs)) {
            songs = [];
            song.id = 0;
          } else {
            let maxID = 0;
            try {
              maxID = _.maxBy(songs, (s) => {
                return s.id;
              }).id;
            } catch(e) {
              songs.forEach((s, index) => {
                s.id = index;
              });
              maxID = songs.length - 1;
            }

            song.id = maxID + 1;
          }
          songs.push(song);

          dispatch(saveSongs(songs));
        }
      }
    )
  }
}

export function deleteSong(id) {
  return dispatch => {
    return localForage.getItem(DATA_SONGS).then(
      (songs, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        }
        else {
          _.remove(songs, (s) => {
            return s.id === id;
          });
          dispatch(saveSongs(songs));
        }
      }
    )
  }
}

export function updateSong(song) {
  return dispatch => {
    return localForage.getItem(DATA_SONGS).then(
      (songs, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_SONG, error}));
        }
        else {
          songs.forEach((s, index) => {
            if(s.id === song.id) {
              songs[index] = song;
            }
          });
          dispatch(saveSongs(songs));
        }
      }
    )
  }
}
// END SONGS