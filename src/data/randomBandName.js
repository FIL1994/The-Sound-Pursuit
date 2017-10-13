/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import _ from 'lodash';

const BAND_NAME_LIST = [
  "The Elephants", "The Edwards", "Wright", "Veron", "Web", "Lore", "Kero", "Delusion", "Gryphon", "Cepphus", "The Spectacled Guillemots", "Lava", "No Proof", "Leech", "Left Turn", "Kennith & the Boys", "Pendant", "Vanilla", "The Cymbals", "The Ones", "Quest", "The Lizards", "Relevant", "Valor", "Walrus", "George & the Gophers", "Octopus", "Orlov", "Tempest", "The Clouds", "Start Again", "The Modules", "The Dividers", "Just", "The Lines", "Gasp", "Far Away", "Medal", "The Circles", "Adjacent X", "Cosmic Child", "Ellipses", "Future & Present", "Precedence", "High Priority", "Old Terror", "Petulant Gaze", "Oh So Visual", "Last Year", "Push & Pull", "Fast Car"
];

export default () => {
  return BAND_NAME_LIST[_.random(0, BAND_NAME_LIST.length-1)];
}