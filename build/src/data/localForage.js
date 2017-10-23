/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import localForage from 'localforage';

localForage.config({
  name: "band-game-alpha",
  version: 1.0
});

// For Testing Only
window.localForage = localForage;

export default localForage;

export const DATA_BAND = "band";
export const DATA_SONGS = "songs";
export const DATA_WEEK = "week";
export const DATA_CASH = "cash";
export const DATA_FANS = "fans";
export const DATA_SINGLES = "singles";
export const DATA_ALBUMS = "albums";