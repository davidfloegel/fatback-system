/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import _ from 'lodash'
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
  TouchableOpacity,
  View
} from 'react-native';

import { LETTERS } from './src/Definitions'

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

    const letterKeys = _.keys( LETTERS )
    const random = _.random( letterKeys.length )

    const TEST = LETTERS[ letterKeys[ random ] ]

    let groups = [];
    const beams = [];

    for( let i = 1; i <= 4; i++ ) {
        const values = TEST.values

        let containsRest = false
        const tmp = values.map( ( x, v ) => {
          containsRest = x.indexOf( 'r' ) > -1 ? true : false
          const type = containsRest ? '' : '/x2'
          let key = [ `f/5${ type }` ]

          if( ( i === 2 || i === 4 ) && v === 0 ) {
              // add backbeat
              if( containsRest ) {
                  x = x.substring( 0, x.length - 1 )
                  key = [ "a/4" ]
              } else {
                  key = [ ...key, "a/4" ]
              }
          }

          const t = new StaveNote( { clef: "percussion", keys: key, duration: x } );

          // add a dot
          if( x.indexOf( 'd' ) > -1 ) {
              t.addDotToAll()
          }

          return t;
        } )

        const beamOverRest = TEST.beamOverRest ? true : false

        const beam = Beam.generateBeams( tmp, { beam_rests: beamOverRest, maintain_stem_directions: true, flat_beams: true } )
        beams.push( ...beam )
        // beams.push( new Beam( tmp ) )


        groups = [ ...groups, ...tmp ]

        // if( containsRest ) {

        // }
    }

    const kickAndSnare = [
      new StaveNote({clef: "percussion", keys: ["d/4"], duration: "q", stem_direction: -1  }),
      new StaveNote({clef: "percussion", keys: ["d/4"], duration: "q", stem_direction: -1  }),
      new StaveNote({clef: "percussion", keys: ["d/4"], duration: "q", stem_direction: -1  }),
      new StaveNote({clef: "percussion", keys: ["d/4"], duration: "q", stem_direction: -1  })
    ];

    const allNotes = groups

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
        <View style={ { height: 150 } }>
          { context.render() }
        </View>

        <View style={ { position: 'absolute', bottom: 10, left: 10 } }>
          <TouchableOpacity onPress={ () => this.setState( { x: _.random( 100 ) } ) }><Text style={ { fontWeight: 'bold' } }>Refresh</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
