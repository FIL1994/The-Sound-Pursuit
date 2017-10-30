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
import localForage, {DATA_BAND, DATA_SONGS, DATA_CASH, DATA_WEEK, DATA_FANS, DATA_ALBUMS, DATA_SINGLES}
  from '../data/localForage';
import {
  unlock100kFans, unlock100kSoldSingles, unlock10kFans, unlock10kSoldSingles, unlock10Years, unlock1kFans, unlock1mFans,
  unlock1mSoldSingles, unlock25Years, unlock5Years, unlock10kSoldAlbums, unlock100kSoldAlbums, unlock1mSoldAlbums,
  unlock100kTotalSoldSingles, unlock1mTotalSoldSingles, unlock10mTotalSoldSingles, unlock100kTotalSoldAlbums,
  unlock1mTotalSoldAlbums, unlock10mTotalSoldAlbums
} from '../ng/UnlockMedals';

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
          return val;
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
          return val;
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
          return val;
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
          weeks = _.isFinite(weeks) ? weeks : 1;

          // get albums and singles
           dispatch(getAlbums()).then((albums) => {
             dispatch(getSingles()).then((singles) => {
               dispatch(getFans()).then((fans) => {
                 if(_.isEmpty(albums) && _.isEmpty(singles)) {
                   val += weeks;
                   localForage.setItem(DATA_WEEK, val);
                   dispatch(sendReturn({type: GET_WEEK, payload: val}));
                   return;
                 }
                 for (let i = 0; i < weeks; i++) {
                   val++;
                   let newData = calculateSales({albums, singles, week: val, fans, dispatch});
                   albums = newData.albums;
                   singles = newData.albums;
                   fans = newData.fans;
                 }

                 // check years medals
                 if(val > 52 * 5) {
                   unlock5Years();
                   if(val > 52 * 10) {
                     unlock10Years();
                     if(val > 52 * 25) {
                       unlock25Years();
                     }
                   }
                 }

                 localForage.setItem(DATA_WEEK, val);
                 dispatch(sendReturn({type: GET_WEEK, payload: val}));
               });
             });
           });
        }
      }
    );
  };

  function calculateSales({albums, singles, week, fans, dispatch}) {
    let newCash = 0, totalSingleSales = 0, totalAlbumSales = 0;
    singles.forEach(({released, quality, salesLastWeek}, index) => {
      const age = week - released;
      const salesLast = 16;
      if(age < salesLast) {
        let sales = _.ceil(((fans * (quality / 120)) * ((salesLast - age)/(salesLast - 1))) * _.random(0.164, 0.231));

        // save sales
        singles[index].salesLastWeek = sales;
        singles[index].sales += sales;

        // calculate cash
        newCash += sales * .2; // $.2 for each single sold

        // calculate new fans
        let multiplier = 0.005;
        if(fans < Math.pow(10, 5)) {
          // less than 100 thousand
          multiplier = .45;
        } else if(fans < Math.pow(10, 6)) {
          // less than 1 million
          multiplier = .25;
        } else if(fans < Math.pow(10, 7)) {
          multiplier = .03;
        }
        fans += _.ceil(sales * multiplier);

        // check single sales medals
        const singleSales = singles[index].sales;
        if(singleSales > 10000) {
          unlock10kSoldSingles();
          if(singleSales > 100000) {
            unlock100kSoldSingles();
            if(singleSales > 1000000) {
              unlock1mSoldSingles();
            }
          }
        }

        console.log(age, "single sales: ", sales);
      } else if(salesLastWeek !== 0) {
        singles[index].salesLastWeek = 0;
      }
      totalSingleSales += singles[index].sales;
    });

    // check total single sales medals
    if(totalSingleSales > 100000) {
      unlock100kTotalSoldSingles();
      if(totalSingleSales > 1000000) {
        unlock1mTotalSoldSingles();
        if(totalSingleSales > 10000000){
          unlock10mTotalSoldSingles();
        }
      }
    }

    albums.forEach(({released, quality, salesLastWeek}, index) => {
      const age = week - released;
      const salesLast = 41;
      if(age < salesLast) {
        let sales = _.ceil(((fans * (quality / 180)) * ((salesLast - age)/(salesLast - 1))) * _.random(.155, .213));

        // save sales
        albums[index].salesLastWeek = sales;
        albums[index].sales += sales;

        // calculate cash
        newCash += sales * 1; // $1 for each album sold

        const albumSales = albums[index].sales;
        if(albumSales > 10000) {
          unlock10kSoldAlbums();
          if(albumSales > 100000) {
            unlock100kSoldAlbums();
            if(albumSales > 1000000) {
              unlock1mSoldAlbums();
            }
          }
        }

        console.log(age, "album: ", sales);
      } else if(salesLastWeek !== 0) {
        albums[index].salesLastWeek = 0;
      }
      totalAlbumSales += albums[index].sales;
    });

    // check total album sales medals
    if(totalAlbumSales > 100000) {
      unlock100kTotalSoldAlbums();
      if(totalAlbumSales > 1000000) {
        unlock1mTotalSoldAlbums();
        if(totalAlbumSales > 10000000){
          unlock10mTotalSoldAlbums();
        }
      }
    }

    if(!_.isEmpty(singles)) {
      dispatch(saveSingles(singles));
    }
    if(!_.isEmpty(albums)) {
      dispatch(saveAlbums(albums));
    }
    dispatch(saveFans(fans));
    dispatch(addCash(newCash));

    dispatch(sendReturn({type: GET_WEEK, payload: week}));

    return {
      albums, singles, fans
    };
  }
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
          return val;
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

          if(newFans > 1000) {
            unlock1kFans();
            if(newFans > 10000) {
              unlock10kFans();
              if(newFans > 100000) {
                unlock100kFans();
                if(newFans > 1000000) {
                  unlock1mFans();
                }
              }
            }
          }

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
          return val;
        }
      }
    );
  };
}

export function saveCash(cash) {
  return dispatch => {
    cash = Number(cash.toFixed(2));

    cash = _.isFinite(cash) ? cash : defaultCash;

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

export function addCash(amount) {
  return dispatch => {
    return localForage.getItem(DATA_CASH).then(
      (cash, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        } else {
          // if val is NaN set val to default cash
          cash = !_.isNaN(cash) ? cash : defaultCash;
          // if val (as a string) is not more than 0 character set val to default cash
          cash = _.toString(cash).length > 0 ? cash : defaultCash;
          // if val is not a finite number set val to default cash
          cash = _.isFinite(cash) ? cash : defaultCash;

          amount = Number(amount);
          cash = Number((cash + amount).toFixed(2));

          dispatch(saveCash(cash));
        }
      }
    );
  };
}

export function removeCash(amount) {
  return dispatch => {
    return localForage.getItem(DATA_CASH).then(
      (cash, error) => {
        if(error) {
          dispatch(sendReturn({type: ERROR_CASH, error}));
        } else {
          // if val is NaN set val to default cash
          cash = !_.isNaN(cash) ? cash : defaultCash;
          // if val (as a string) is not more than 0 character set val to default cash
          cash = _.toString(cash).length > 0 ? cash : defaultCash;
          // if val is not a finite number set val to default cash
          cash = _.isFinite(cash) ? cash : defaultCash;

          amount = Number(amount);
          cash = Number((cash - amount).toFixed(2));

          dispatch(saveCash(cash));
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
          return singles;
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
          return albums;
        }
      }
    );
  };
}

export function saveAlbums(albums) {
  return dispatch => {
    console.log("SaveAlbums", albums);
    return localForage.setItem(DATA_ALBUMS, albums).then(
      (val, error) => {
        if (error) {
          dispatch(sendReturn({type: ERROR_ALBUMS, error}));
        }
        else {
          dispatch(sendReturn({type: SAVE_ALBUMS, payload: albums}));
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
            console.log("addAlbum", albums);
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
          console.log("addAlbum NEW", albums);
          dispatch(saveAlbums(albums));
        }
      }
    );
  }
}
// END ALBUMS