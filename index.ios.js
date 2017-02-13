/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import _ from 'lodash'
import React, { Component } from 'react';
import { Dimensions } from 'react-native'
import { Accidental } from 'vexflow/src/accidental';
import { Stave } from 'vexflow/src/stave';
import { StaveNote } from 'vexflow/src/stavenote';
import { Voice } from 'vexflow/src/voice';
import { Beam } from 'vexflow/src/beam';
import { Formatter } from 'vexflow/src/formatter';
import { ReactNativeSVGContext, NotoFontPack } from 'standalone-vexflow-context';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { height, width } = Dimensions.get( 'window' )

import { LETTERS } from './src/Definitions'

const MUSO_MAIN = '#898CFF'

export default class FatbackSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {
       height: 0,
       width: 0,
       workspaceWidth: 0,
       workspaceHeight: 0
    }
  }

  componentDidMount() {
    this.setState( { 
      height, 
      width,
      workspaceHeight: ( height || 0 ) * 0.7, // 70% of screenheight
      workspaceWidth: ( width || 0 ) * 0.9 // 90% of screenwidth
    } )
  }

  runVexFlowCode(context, width, height) {
    const stave = new Stave(0, height/3.5, Math.round( width ) - 1 );
    stave.setContext(context);
    stave.setClef('percussion');
    stave.setTimeSignature('4/4');
    stave.draw();

    const letterKeys = _.keys( LETTERS )
    const random = _.random( letterKeys.length - 1 )

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
        
        const beam = Beam.generateBeams( tmp, { beam_rests: true, beam_middle_only: true, maintain_stem_directions: true, flat_beams: true } )
        beams.push( ...beam )


        groups = [ ...groups, ...tmp ]

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
    const { workspaceWidth, workspaceHeight } = this.state

    if( !workspaceWidth && !workspaceHeight || ( workspaceHeight === 0 || workspaceWidth === 0 ) ) {
      return null
    }

    const context = new ReactNativeSVGContext(NotoFontPack, { width: workspaceWidth, height: workspaceHeight });
    this.runVexFlowCode(context, workspaceWidth, workspaceHeight);


    return (
      <View style={styles.container}>
        <View style={ styles.header }>
          <View style={ [ styles.headerAside, styles.headerLeft ] }>
            <TouchableOpacity onPress={ () => this.setState( { x: _.random( 100 ) } ) }>
              <Icon name="refresh" size={ 20 } color={ MUSO_MAIN } />
            </TouchableOpacity>
          </View>
          <View style={ styles.headerTitle }><Text style={ styles.title }>The Fatback System</Text></View>
          <View style={ [ styles.headerAside, styles.headerRight ] }><Icon name="cog" size={ 20 } color={ MUSO_MAIN } /></View>
        </View>

        <View>
            { context.render() }
        </View>

        <View style={ styles.footer }>
          <Text style={ styles.footerText }>Powered by Muso Solutions</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    backgroundColor: '#f9f9f9',
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

  header: {
    backgroundColor: '#fff',
    height: 50,
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    shadowColor: '#444',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: .3,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },

  headerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16
  },
  headerAside: {
    flex: 1,
    justifyContent: 'center'
  },
  headerLeft: {
    paddingLeft: 20
  },
  headerRight: {
    paddingRight: 20,
    alignItems: 'flex-end'
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 10,
    color: '#ccc',
    paddingVertical: 10
  }
});

AppRegistry.registerComponent('ReactNativeVexFlow', () => FatbackSystem);
