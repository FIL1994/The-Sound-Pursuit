/**
 * @author Philip Van Raalte
 * @date 2017-10-10.
 */
import _ from 'lodash';

const BAND_NAME_LIST = [
  "The Elephants", "The Edwards", "Wright", "Veron", "Web", "Lore", "Kero", "Delusion", "Gryphon", "Cepphus", "The Spectacled Guillemots", "Lava", "No Proof", "Leech", "Left Turn", "Kennith & the Boys", "Pendant", "Vanilla", "The Cymbals", "The Ones", "Quest", "The Lizards", "Relevant", "Valor", "Walrus", "George & the Gophers", "Octopus", "Orlov", "Tempest", "The Clouds", "Start Again", "The Modules", "The Dividers", "Just", "The Lines", "Gasp", "Far Away", "Medal", "The Circles", "Adjacent X", "Cosmic Child", "Ellipses", "Future & Present", "Precedence", "High Priority", "Old Terror", "Petulant Gaze", "Oh So Visual", "Last Year", "Push & Pull", "Fast Car", "Purple", "Machine", "Tire", "Burning Lake", "Rise", "Red Doom", "Weeping Iguanas", "Nuclear", "The Refugees", "Number 821", "C1K0", "Future VS. Past", "Final Marathon", "The Hipsters", "Centaur", "Y2K", "Little Rocks", "The Teacups", "Bold", "Total Power", "The Jakes", "Amy's Band", "The Nadines", "Unwound Coil", "Plain Normal", "Jealousy", "Oliver is Okay", "Alright, Okay", "Banner"
];

export default () => {
  return BAND_NAME_LIST[_.random(0, BAND_NAME_LIST.length-1)];
}