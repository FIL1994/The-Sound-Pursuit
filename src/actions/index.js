/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import _ from 'lodash';
import {
  SAVE_BAND, GET_BAND, ERROR_BAND, GET_SONGS, ERROR_SONG, SAVE_SONGS,
  SAVE_CASH, GET_CASH, ERROR_CASH, SAVE_WEEK, GET_WEEK, ERROR_WEEK, GET_FANS, SAVE_FANS, ERROR_FANS, GET_SINGLES,
  ERROR_SINGLES, ERROR_ALBUMS, GET_ALBUMS, SAVE_SINGLES, SAVE_ALBUMS
} from './types';
import localForage, {DATA_BAND, DATA_SONGS, DATA_CASH, DATA_WEEK, DATA_FANS, DATA_ALBUMS, DATA_SINGLES} from '../data/localForage';

const defaultCash = 250;

function sendReturn({type, payload, error}) {
  return {
    type,
    payload,
    error
  }
}

// START BAND
export function saveBand(band) {
  return dispatch => {
    return localForage.setItem(DATA_BAND, band).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_BAND, error}));
        } else {
          dispatch(sendReturn({type: SAVE_BAND, payload: val}));
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
            song.single = null;
            song.album = null;
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

// START WEEK
export function getWeek() {
  return dispatch => {
    return localForage.getItem(DATA_WEEK).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_WEEK, error}));
        } else {
          val = _.defaultTo(Number(val), 0);
          dispatch(sendReturn({type: GET_WEEK, payload: val}));
        }
      }
    );
  };
}

export function saveWeek(week) {
  return dispatch => {
    return localForage.setItem(DATA_WEEK, week).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_WEEK, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_WEEK, payload: val}));
        }
      }
    );
  };
}

export function nextWeek(weeks) {
  return dispatch => {
    return localForage.getItem(DATA_WEEK).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_WEEK, error}));
        } else {
          val = _.defaultTo(Number(val), 0);

          val += _.isFinite(weeks) ? weeks : 1;
          localForage.setItem(DATA_WEEK, val);

          dispatch(sendReturn({type: GET_WEEK, payload: val}));
        }
      }
    );
  };
}
// END WEEK

// START FANS
export function getFans() {
  return dispatch => {
    return localForage.getItem(DATA_FANS).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_FANS, error}));
        } else {
          val = _.defaultTo(Number(val), 0);
          dispatch(sendReturn({type: GET_FANS, payload: val}));
        }
      }
    );
  };
}

export function saveFans(fans) {
  return dispatch => {
    return localForage.setItem(DATA_FANS, fans).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_FANS, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_FANS, payload: val}));
        }
      }
    );
  };
}

export function addFans(newFans) {
  return dispatch => {
    return localForage.getItem(DATA_FANS).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_FANS, error}));
        } else {
          val = _.defaultTo(Number(val), 0);
          newFans = _.ceil(val + _.defaultTo(Number(newFans), 1));
          dispatch(saveFans(newFans));
        }
      }
    );
  }
}
// END FANS

// START CASH
export function getCash() {
  return dispatch => {
    return localForage.getItem(DATA_CASH).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        } else {
          let originalVal = _.clone(val);
          // if val is NaN set val to default cash
          val = !_.isNaN(val) ? val : defaultCash;
          // if val (as a string) is not more than 0 character set val to default cash
          val = _.toString(val).length > 0 ? val : defaultCash;
          // if val is not a finite number set val to default cash
          val = _.isFinite(val) ? val : defaultCash;

          if(originalVal !== val) {
            localForage.setItem(DATA_CASH, val);
          }

          dispatch(sendReturn({type: GET_CASH, payload: val}));
        }
      }
    );
  };
}

export function saveCash(cash) {
  return dispatch => {
    return localForage.setItem(DATA_CASH, cash).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_CASH, payload: val}));
        }
      }
    );
  };
}

export function addCash(newCash) {
  return dispatch => {
    return localForage.getItem(DATA_CASH).then(
      (val, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        } else {
          // if val is NaN set val to default cash
          val = !_.isNaN(val) ? val : defaultCash;
          // if val (as a string) is not more than 0 character set val to default cash
          val = _.toString(val).length > 0 ? val : defaultCash;
          // if val is not a finite number set val to default cash
          val = _.isFinite(val) ? val : defaultCash;

          newCash = Number(newCash);
          val = Number((val + newCash).toFixed(2));

          dispatch(saveCash(val));
        }
      }
    );
  };
}
// END CASH

// START SINGLES
export function getSingles() {
  return dispatch => {
    return localForage.getItem(DATA_SINGLES).then(
      (singles, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_SINGLES, error}));
        } else {
          if(_.isEmpty(singles)) {
            singles = [];
          }
          dispatch(sendReturn({type: GET_SINGLES, payload: singles}));
        }
      }
    );
  };
}

export function saveSingles(singles) {
  return dispatch => {
    return localForage.setItem(DATA_SINGLES, singles).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_SINGLES, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_SINGLES, payload: val}));
        }
      }
    );
  };
}

export function addSingle(single) {
  return dispatch => {
    return localForage.getItem(DATA_SINGLES).then(
      (singles, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_SINGLES, error}));
        }
        else {
          if (_.isEmpty(singles)) {
            singles = [];
            single.id = 0;
          } else {
            let maxID = 0;
            try {
              maxID = _.maxBy(singles, (s) => {
                return s.id;
              }).id;
            } catch (e) {
              singles.forEach((s, index) => {
                s.id = index;
              });
              maxID = singles.length - 1;
            }
            single.id = maxID + 1;
          }
          singles.push(single);
          dispatch(saveSingles(singles));
        }
      }
    );
  }
}
// END SINGLES

// START ALBUMS
export function getAlbums() {
  return dispatch => {
    return localForage.getItem(DATA_ALBUMS).then(
      (albums, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_ALBUMS, error}));
        } else {
          if(_.isEmpty(albums)) {
            albums = [];
          }
          dispatch(sendReturn({type: GET_ALBUMS, payload: albums}));
        }
      }
    );
  };
}

export function saveAlbums(singles) {
  return dispatch => {
    return localForage.setItem(DATA_ALBUMS, singles).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: SAVE_ALBUMS, error}));
        }
        else {
          dispatch(sendReturn({type: GET_ALBUMS, payload: val}));
        }
      }
    );
  };
}

export function addAlbum(album) {
  return dispatch => {
    return localForage.getItem(DATA_ALBUMS).then(
      (albums, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_ALBUMS, error}));
        } else {
          if(_.isEmpty(albums)) {
           albums = [];
           album.id = 0;
          } else {
            let maxID = 0;
            try {
              maxID = _.maxBy(albums, (a) => {
                return a.id;
              }).id;
            } catch(e) {
              albums.forEach((a, index) => {
                a.id = index;
              });
              maxID = albums.length -1;
            }
            album.id = maxID + 1;
          }
          albums.push(album);
          dispatch(saveAlbums(albums));
        }
      }
    );
  }
}
// END ALBUMS