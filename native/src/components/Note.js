import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import classnames from 'classnames';
import {
  stopPlayingNote,
  playNote,
  loadSound,
} from '../MusicManager';

import callIfExists from '../utils/callIfExists';
import isDefined from '../utils/isDefined';

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.playingBuffers = [];
    this.sound = {};
    this.state = {
      isPlaying: false,
      isLoading: true,
    };
    this.startPlayingNote = this.startPlayingNote.bind(this);
    this.stopPlayingNote = this.stopPlayingNote.bind(this);
  }
  async componentDidMount() {
    this.sound = await this.loadSound();
  }
  async componentWillReceiveProps(nextProps) {
    if (
      (nextProps.instrumentName !== this.props.instrumentName) ||
      (nextProps.name !== this.props.name)
    ) {
      await this.loadSound();
    }
    if (!this.props.play && nextProps.play) {
      await this.startPlayingNote();
      // console.log('Changed props to play, started playing note');
    }
    if (this.props.play && !nextProps.play) {
      await this.stopPlayingNote();
    }
  }
  componentWillUnmount() {
    this.sound.release();
  }
  async loadSound() {
    this.setState({ isLoading: true });
    try {
      this.sound = await loadSound(this.props.instrumentName, this.props.name);
    } catch (err) {
      this.setState({ isLoading: false });
      console.warn(JSON.stringify(err.message, 2, 2));
      return null;
    }
    this.setState({ isLoading: false });
    callIfExists(this.props.onNoteLoaded, this.props.instrumentName, this.props.name);
    return this.sound;
  }
  async startPlayingNote() {
    this.setState({ isPlaying: true });
    try {
      const buffer = await playNote(this.sound);
      return buffer;
    } catch (err) {
      console.warn('Something wrong happened with the audio api while playing note ');
      return {};
    }
  }
  async stopPlayingNote() {
    await stopPlayingNote(this.sound);
    this.setState({ isPlaying: false });
  }
  render() {
    if (this.state.isLoading) {
      return isDefined(this.props.loader, <View><Text> Loading Note </Text></View>);
    }
    return (
      <TouchableWithoutFeedback
        onPressIn={this.startPlayingNote}
        onPressOut={this.stopPlayingNote}
        delayPressOut={isDefined(this.props.delayPressOut, 700)}
        className={
          `${isDefined(this.props.className, '')} ${classnames({
            'ro-note-playing': this.state.isPlaying,
          }, {
            'ro-note-loading': this.state.isLoading,
          })}`
        }
      >
        {
          <View>{this.props.children}</View> || <View />
        }
      </TouchableWithoutFeedback>
    );
  }
}

Note.defaultProps = {
  play: false,
};
export default Note;
//
// import React from 'react';
// import classnames from 'classnames';
// import {
//   stopPlayingNote,
//   playNote,
//   loadSound,
// } from '../MusicManager';
// import callIfExists from '../../../utils/callIfExists';
// import isDefined from '../../../utils/isDefined';
//
// class Note extends React.Component {
//   constructor(props) {
//     super(props);
//     this.playingBuffers = [];
//     this.state = {
//       isPlaying: false,
//       isLoading: true,
//     };
//     this.startPlayingNote = this.startPlayingNote.bind(this);
//     this.stopPlayingNote = this.stopPlayingNote.bind(this);
//     this.onClickStart = this.onClickStart.bind(this);
//   }
//   async componentDidMount() {
//     await this.loadSound();
//   }
//   async componentWillReceiveProps(nextProps) {
//     if (
//       (nextProps.instrumentName !== this.props.instrumentName) ||
//       (nextProps.name !== this.props.name)
//     ) {
//       await this.loadSound();
//     }
//     if (!this.props.play && nextProps.play) {
//       await this.startPlayingNote();
//       // console.log('Changed props to play, started playing note');
//     }
//     if (this.props.play && !nextProps.play) {
//       await this.stopPlayingNote();
//       // console.log('Changed props to stop playing');
//     }
//   }
//   onClickStart() {
//     if (window.isTouchDevice) {
//       return;
//     }
//     this.startPlayingNote();
//   }
//   async loadSound() {
//     this.setState({ isLoading: true });
//     try {
//       await loadSound(this.props.instrumentName, this.props.name);
//     } catch (err) {
//       this.setState({ isLoading: false });
//       return;
//     }
//     this.setState({ isLoading: false });
//     callIfExists(this.props.onNoteLoaded, this.props.instrumentName, this.props.name);
//   }
//   async startPlayingNote() {
//     // if (this.props.interactive === false) return;
//     this.setState({ isPlaying: true });
//     try {
//       const buffer = await playNote(this.props.instrumentName, this.props.name);
//       this.playingBuffers.push(buffer);
//     } catch (err) {
//       console.warn('Something wrong happened with the audio api while playing note ');
//     }
//   }
//   async stopPlayingNote() {
//     if (this.playingBuffers && this.playingBuffers.length === 0) {
//       return;
//     }
//     const buffer = this.playingBuffers.pop();
//     const fadeOutDuration = this.props.fadeOutDuration ? this.props.fadeOutDuration : 700;
//     await stopPlayingNote(buffer, fadeOutDuration);
//     this.setState({ isPlaying: false });
//   }
//   render() {
//     if (this.state.isLoading) {
//       // console.log(isDefined(this.props.loader, '<div> Loading Note </div>'))
//       return isDefined(this.props.loader, <div> Loading Note </div>);
//     }
//     return (
//       <div
//         onTouchStart={this.startPlayingNote}
//         onTouchEnd={this.stopPlayingNote}
//         onMouseDown={this.onClickStart}
//         onMouseUp={this.stopPlayingNote}
//         className={
//           `${isDefined(this.props.className, '')} ${classnames({
//             'ro-note-playing': this.state.isPlaying,
//           }, {
//             'ro-note-loading': this.state.isLoading,
//           })}`
//         }
//       >
//         {
//           this.props.children || <div />
//         }
//       </div>
//     );
//   }
// }
// Note.defaultProps = {
//   play: false,
// };
// export default Note;
