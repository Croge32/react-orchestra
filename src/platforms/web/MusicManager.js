import { noteNamesWithOctaves } from '../../constants/NOTE_NAMES';
import Sound from './Sound';
import audioContext from './AudioContextSingleton';
import Store from './stores/';

const baseURL = 'https://raw.githubusercontent.com/RakanNimer/midi-js-soundfonts/master/MusyngKite';
const playingNotes = {};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const instrumentNameToRemotePath = instrumentName => `${baseURL}/${instrumentName}-mp3`;
const instrumentAndNoteNameToRemotePath = (instrumentName, noteName) => `${baseURL}/${instrumentName}-mp3/${noteName}.mp3`;

const generateNoteKey = (instrumentName, noteName) => `${instrumentName}-${noteName}`;

const getSoundFromRemote = async (instrumentName, noteName) => {
  const noteURL = instrumentAndNoteNameToRemotePath(instrumentName, noteName);
  const mp3 = await fetch(noteURL);
  const mp3Blob = await mp3.arrayBuffer();
  return mp3Blob;
};

const getNoteBlob = async (instrumentName, noteName) => {
  const noteKey = generateNoteKey(instrumentName, noteName);
  console.log(noteKey);
  const isNoteCached = await Store.exists(noteKey);
  if (isNoteCached) {
    const item = await Store.get(noteKey);
    return item;
  }
  const noteBlob = await getSoundFromRemote(instrumentName, noteName);
  return noteBlob;
};

const loadSound = async (instrumentName, noteName) => {
  const noteBlob = await getNoteBlob(instrumentName, noteName)
  return noteBlob;
};

const playSound = (noteBlob) => new Promise((resolve, reject) => {
  audioContext.decodeAudioData(
      noteBlob,
      async (buffer) => {
        // create a sound source
        const source = audioContext.createBufferSource();
        // tell the source which sound to play
        source.buffer = buffer;
        // connect the source to the context's destination (the speakers)
        source.connect(audioContext.destination);
        source.start(0);
        resolve(source);
        // await delay(fadeOutDuration);
        // source.stop();
      },
      (err) => {
        reject(err);
      },
  );
});

const playNote = async (instrumentName, noteName) => {
  const noteBlob = await getNoteBlob(instrumentName, noteName);
  return await playSound(noteBlob);
};

const stopPlayingNote = (instrumentName, noteName) => {

  // console.warn(`Stop playing note ${notePath}${JSON.stringify(Object.keys(playingNotes), 2, 2)}`);
  // if (notePath in playingNotes) {
  //   const noteSound = playingNotes[notePath];
  //   try {
  //     noteSound.stop();
  //     noteSound.release();
  //     delete playingNotes[notePath];
  //   } catch (err) {
  //     noteSound.stop();
  //     console.warn(`ERROR PLAYING Cached NOTE ${err.message}`);
  //   }
  // } else {
  //   console.warn('STOPPING NOTE THAT ISNT BEING PLAYED');
  // }
};

const sharpToBemol = (noteName) => {
  if (noteName.indexOf('#') > -1) {
    const noteNameNoOctave = noteName[0];
    const octave = noteName[noteName.length - 1];
    const noteCharCode = noteNameNoOctave.charCodeAt(0);
    const newNote = noteNameNoOctave !== 'G' ? `${String.fromCharCode(noteCharCode + 1)}b${octave}` : `Ab${octave}`;
    return newNote;
  }
  return noteName;
};


export {
  playSound,
  playNote,
  sharpToBemol,
  instrumentNameToRemotePath,
  stopPlayingNote,
  getNoteBlob,
  getSoundFromRemote,
  loadSound,
};
