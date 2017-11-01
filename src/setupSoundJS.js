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

  let songStarted = false;
  createjs.Sound.on("fileload", () => {
    localForage.getItem(PLAY_SONG).then(playSong => {
      if (!songStarted) {
        // make sure there is only one song playing
        try {
          window.songPlaying.destroy();
        } catch (e) {}
        try {
          window.songPlaying = createjs.Sound.play(SONGS.PianoLoop.id, {loop: -1, volume: window.VOLUME});

          if (playSong) {
            if (playSong !== "on") {
              window.songPlaying.stop();
            }
          } else {
            localForage.setItem(PLAY_SONG, "on");
          }
          if(window.songPlaying.playState !== "playFailed") {
            songStarted = true;
          }
        } catch(e) {
          console.log("Song Start Error: ", e);
        }
      }
    })
  }, this);

  createjs.Sound.registerSounds(sounds, assetPath);
}