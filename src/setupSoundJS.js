import _ from 'lodash';
import localForage, {PLAY_SONG}
  from './data/localForage';
import SONGS from './data/Songs';

// prevent starting multiple songs
if (_.isEmpty(window.songPlaying)) {
  console.log("Starting");
  window.VOLUME = 1;

  const assetPath = "assets/";
  const sounds = [
    {id: SONGS.DeepThinkerIntro.id, src: SONGS.DeepThinkerIntro.src},
    {id: SONGS.DeepThinker.id, src: SONGS.DeepThinker.src},
    {id: SONGS.PianoLoop.id, src: SONGS.PianoLoop.src}
  ];

  createjs.Sound.on("fileload", () => {
    localForage.getItem(PLAY_SONG).then(playSong => {
      // make sure there is only one song playing
      try {
        window.songPlaying.destroy();
      } catch(e){}
      window.songPlaying = createjs.Sound.play(SONGS.DeepThinkerIntro.id, {volume: window.VOLUME});

      window.songPlaying.on("complete", () => {
        window.songPlaying.destroy();
        window.songPlaying = createjs.Sound.play(SONGS.DeepThinker.id, {loop: -1, volume: window.VOLUME});
      }, this);

      if (playSong) {
        if (playSong !== "on") {
          window.songPlaying.stop();
        }
      } else {
        localForage.setItem(PLAY_SONG, "on");
      }
    })
  }, this);

  createjs.Sound.registerSounds(sounds, assetPath);
}