/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import localForage from 'localforage';

localForage.config({
  name: "band-game",
  version: 1.0
});

// For Testing Only
// window.localForage = localForage;

export default localForage;

export const BAND = "band";