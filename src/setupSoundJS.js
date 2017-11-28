import _ from 'lodash';
import localForage, {PLAY_SONG, PLAY_MAIN_THEME, SONG_VOLUME}
  from './data/localForage';
import SONGS from './data/Songs';

// prevent starting multiple songs
if (_.isEmpty(window.songPlaying)) {
  console.log("Starting");
  window.VOLUME = 1;

  const assetPath = "/assets/";
  const sounds = [
    {id: SONGS.DeepThinkerIntro.id, src: SONGS.DeepThinkerIntro.src},
    {id: SONGS.DeepThinker.id, src: SONGS.DeepThinker.src},
    {id: SONGS.PianoLoop.id, src: SONGS.PianoLoop.src}
  ];

  let songStarted = false;
  createjs.Sound.on("fileload", () => {
    localForage.getItem(SONG_VOLUME).then(songVolume => {
      if(_.isFinite(songVolume)) {
        window.VOLUME = Number(songVolume);
      }

      localForage.getItem(PLAY_SONG).then(playSong => {
        if (!songStarted) {
          // make sure there is only one song playing
          try {
            window.songPlaying.destroy();
          } catch (e) {}

          try {
            localForage.getItem(PLAY_MAIN_THEME).then(playMainTheme => {
              // if playMainTheme isn't empty and is false play the DeepThinker song
              if (!_.isEmpty(playMainTheme) && playMainTheme.toString() === false.toString()) {
                window.songPlaying = createjs.Sound.play(SONGS.DeepThinkerIntro.id, {volume: window.VOLUME});

                window.songPlaying.on("complete", () => {
                  window.songPlaying.destroy();
                  window.songPlaying = createjs.Sound.play(SONGS.DeepThinker.id, {loop: -1, volume: window.VOLUME});
                }, this);
              } else {
                // if playMainTheme is empty or false play the main theme
                window.songPlaying = createjs.Sound.play(SONGS.PianoLoop.id, {loop: -1, volume: window.VOLUME});
              }
            }).then(() => {
              if (playSong) {
                if (playSong !== "on") {
                  window.songPlaying.stop();
                }
              } else {
                localForage.setItem(PLAY_SONG, "on");
              }
              if (window.songPlaying.playState === "playSucceeded") {
                songStarted = true;
              }
            });
          } catch (e) {
            console.log("Song Start Error: ", e);
          }
        }
      });
    });
  }, this);

  createjs.Sound.registerSounds(sounds, assetPath);
}