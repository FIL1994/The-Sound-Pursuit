/**
 * @author Philip Van Raalte
 * @date 2017-10-09.
 */
import getRandomName from './names';
import {Chance} from 'chance';
const CHANCE = new Chance(new Date().getTime());

export default (level) => {
  let min = level > 10 ? level - 8 : 1;
  let max = level < 95 ? level + 5 : level;

  return {
    name: getRandomName(),
    skills: {
      songwriting: CHANCE.integer({min, max}),
      musicianship: CHANCE.integer({min, max}),
      live: CHANCE.integer({min, max}),
      studio: CHANCE.integer({min, max})
    }
  };
};