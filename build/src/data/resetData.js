/**
 * @author Philip Van Raalte
 * @date 2017-10-18.
 */
import localForage, {DATA_BAND, DATA_SONGS, DATA_CASH, DATA_WEEK, DATA_FANS, DATA_ALBUMS, DATA_SINGLES}
  from '../data/localForage';

export default () => {
  resetDataAsync();
}

export const resetDataAsync = () => {
  return Promise.all([
    localForage.removeItem(DATA_BAND),
    localForage.removeItem(DATA_SONGS),
    localForage.removeItem(DATA_CASH),
    localForage.removeItem(DATA_WEEK),
    localForage.removeItem(DATA_FANS),
    localForage.removeItem(DATA_ALBUMS),
    localForage.removeItem(DATA_SINGLES)
  ]);
};