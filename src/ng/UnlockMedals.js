/**
 * @author Philip Van Raalte
 * @date 2017-10-21.
 */
import _ from 'lodash';
import {unlockMedal, getMedals, getUser} from './NG_Connect';

const medalTimeoutShort = 350;
const medalTimeoutLong = 2000;

export class NG {
  static fetchedUser = false;
  static unlockQueue = [];
  static executeQueue() {
    Promise.all(NG.unlockQueue.map((uq) => new Promise(uq)))
      .then(() => console.log("UnlockMedal Queue Executed"));
  }
}

async function forceUnlockMedal(medalName) {
  // if user isn't fetched yet, queue unlocking the medal
  if(!NG.fetchedUser) {
    NG.unlockQueue.push(() => forceUnlockMedal(medalName));
    return;
  }

  if(!_.isString(medalName)) {
    return;
  }
  unlockThisMedal();

  function unlockThisMedal() {
    console.log("unlock", medalName);
    getMedals((result) => {
      if(result.success) {
        let medal = result.medals.find((m) => {
          return m.name === medalName;
        });
        const isUser = !_ .isEmpty(getUser());
        if(isUser) {
          if (!medal.unlocked) {
            unlockMedal(medalName);
            setTimeout(unlockThisMedal, medalTimeoutShort);
          }
          else {
            // An error occurred wait longer before making another network request
            setTimeout(unlockThisMedal, medalTimeoutLong);
          }
        }
      }
    });
  }
}

export function unlockStartBand() {
  forceUnlockMedal("Start a Band");
}

export function unlockReleaseSingle() {
  forceUnlockMedal("Release a Single");
}

export function unlockReleaseAlbum() {
  forceUnlockMedal("Release an Album");
}

export function unlockWriteSong() {
  forceUnlockMedal("Write a Song");
}

export function unlockRecordSong() {
  forceUnlockMedal("Record a Song");
}

export function unlockFirstShow() {
  forceUnlockMedal("First Show");
}

export function unlockFirstPractice() {
  forceUnlockMedal("First Practice");
}

export function unlock5Years() {
  forceUnlockMedal("5 Years");
}

export function unlock10Years() {
  forceUnlockMedal("10 Years");
}

export function unlock25Years() {
  forceUnlockMedal("25 Years");
}

export function unlock1kFans() {
  forceUnlockMedal("1K Fans");
}

export function unlock10kFans() {
  forceUnlockMedal("10K Fans");
}

export function unlock100kFans() {
  forceUnlockMedal("100K Fans");
}

export function unlock1mFans() {
  forceUnlockMedal("1M Fans");
}

export function unlock10kSoldSingles() {
  forceUnlockMedal("10K Sold Singles");
}

export function unlock100kSoldSingles() {
  forceUnlockMedal("100K Sold Singles");
}

export function unlock1mSoldSingles() {
  forceUnlockMedal("1M Sold Singles");
}

export function unlock10kSoldAlbums() {
  forceUnlockMedal("10K Sold Albums");
}

export function unlock100kSoldAlbums() {
  forceUnlockMedal("100K Sold Albums");
}

export function unlock1mSoldAlbums() {
  forceUnlockMedal("1M Sold Albums");
}

export function unlock100kTotalSoldSingles() {
  forceUnlockMedal("100K Total Sold Singles");
}

export function unlock1mTotalSoldSingles() {
  forceUnlockMedal("1M Total Sold Singles");
}

export function unlock10mTotalSoldSingles() {
  forceUnlockMedal("10M Total Sold Singles");
}

export function unlock100kTotalSoldAlbums() {
  forceUnlockMedal("100K Total Sold Albums");
}

export function unlock1mTotalSoldAlbums() {
  forceUnlockMedal("1M Total Sold Albums");
}

export function unlock10mTotalSoldAlbums() {
  forceUnlockMedal("10M Total Sold Albums");
}

export function unlock100NewFans() {
  forceUnlockMedal("100 New Fans");
}

export function unlock200NewFans() {
  forceUnlockMedal("200 New Fans");
}

export function unlockSkills25() {
  forceUnlockMedal("Skills 25+");
}

export function unlockSkills50() {
  forceUnlockMedal("Skills 50+");
}

export function unlockSkills75() {
  forceUnlockMedal("Skills 75+");
}