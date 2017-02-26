import Instrument from './components/Instrument';
import Note from './components/Note';
import Orchestra from './components/Orchestra';
import NoteFactory from './components/NoteFactory';
import KeyBinding from './components/KeyBinding';
// import NoteHelpers from './utils/NoteHelpers';
import { InstrumentHelpers } from './InstrumentJS/src/';
import MusicManager from './MusicManager';

window.isTouchDevice = 'ontouchstart' in document.documentElement;

export default {
  Instrument,
  Note,
  Orchestra,
  NoteFactory,
  KeyBinding,
  InstrumentHelpers,
  MusicManager,
//  NoteHelpers
};

export {
  Instrument,
  Note,
  Orchestra,
  NoteFactory,
  KeyBinding,
  InstrumentHelpers,
  MusicManager,
//  NoteHelpers
};
