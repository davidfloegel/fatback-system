/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Accidental } from 'vexflow/src/accidental';
import { Stave } from 'vexflow/src/stave';
import { StaveNote } from 'vexflow/src/stavenote';
import { Voice } from 'vexflow/src/voice';
import { Beam } from 'vexflow/src/beam';
import { Formatter } from 'vexflow/src/formatter';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class FatbackSystem extends Component {
  constructor(props) {
    super(props);
  }

  runVexFlowCode(context) {
    const stave = new Stave(0, 150, 590);
    stave.setContext(context);
    stave.setClef('percussion');
    stave.setTimeSignature('4/4');
    stave.draw();

    const group1 = [
      new StaveNote({clef: "percussion", keys: ["f/5/x2"], duration: "8" }),
      new StaveNote({clef: "percussion", keys: ["f/5/x2"], duration: "16" }),
      new StaveNote({clef: "percussion", keys: ["f/5/x2"], duration: "16" }),
    ]

    const group2 = [
      new StaveNote({clef: "percussion", keys: ["f/5/x2", "a/4"], duration: "8" }),
      new StaveNote({clef: "percussion", keys: ["f/5/x2"], duration: "8" }),
    ]

    const group3 = [
      new StaveNote({clef: "percussion", keys: ["f/5/x2"], duration: "8" }),
      new StaveNote({clef: "percussion", keys: ["f/5/x2"], duration: "8" }),
    ]

    const group4 = [
      new StaveNote({clef: "percussion", keys: ["f/5/x2", "a/4"], duration: "8" }),
      new StaveNote({clef: "percussion", keys: ["f/5/x2"], duration: "16" }),
      new StaveNote({clef: "percussion", keys: ["f/5/x2"], duration: "16" }),
    ]



    const kickAndSnare = [
      new StaveNote({clef: "percussion", keys: ["d/4"], duration: "q", stem_direction: -1  }),
      new StaveNote({clef: "percussion", keys: ["d/4"], duration: "q", stem_direction: -1  }),
      new StaveNote({clef: "percussion", keys: ["d/4"], duration: "q", stem_direction: -1  }),
      new StaveNote({clef: "percussion", keys: ["d/4"], duration: "q", stem_direction: -1  })
    ];

    beams = [
      new Beam(group1),
      new Beam(group2),
      new Beam(group3),
      new Beam(group4)
    ]

    const allNotes = [
      ...group1, ...group2, ...group3, ...group4
    ]

    const voice = new Voice({num_beats: 4,  beat_value: 4});
    voice.addTickables(allNotes);

    const voice2 = new Voice({num_beats: 4,  beat_value: 4});
    voice2.addTickables(kickAndSnare);

    const formatter = new Formatter().joinVoices([voice, voice2]).formatToStave([voice, voice2], stave);
    voice.draw(context, stave);
    
    voice2.draw(context, stave);
    
    beams.forEach(function(b) {b.setContext(context).draw()})
  }

  render() {
    const context = new ReactNativeSVGContext(NotoFontPack, { width: 600, height: 400 });
    this.runVexFlowCode(context);

    return (
      <View style={styles.container}>
        { context.render() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNativeVexFlow', () => FatbackSystem);
