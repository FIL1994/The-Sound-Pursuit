/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import {Chance} from "chance";
const CHANCE = new Chance(new Date().getTime());

const BAND_NAME_LIST = [
  "The Elephants", "The Edwards", "Wright", "Veron", "Web", "Lore", "Kero", "Delusion", "Gryphon", "Cepphus", "The Spectacled Guillemots", "Lava", "No Proof", "Leech", "Left Turn", "Kennith & the Boys", "Pendant", "Vanilla", "The Cymbals", "The Ones", "Quest", "The Lizards", "Relevant", "Valor", "Walrus", "George & the Gophers", "Octopus", "Orlov", "Tempest", "The Clouds", "Start Over Again", "The Modules", "The Dividers"
];

export default () => {
  return CHANCE.pickone(BAND_NAME_LIST);
}