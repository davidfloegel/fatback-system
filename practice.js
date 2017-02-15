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

import { LETTERS, LETTERS_LEVELS, TRIPLET_LETTERS, TRIPLET_LETTERS_LEVELS } from './src/Definitions'

const MUSO_MAIN = '#898CFF'

export default class FatbackSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {
       height: 0,
       width: 0,
       workspaceWidth: 0,
       workspaceHeight: 0,
       context: null,
       hihatLetter: 'A',
       kickLetter: 'A'
    }
  }

  componentDidMount() {
    this.calcWorkSpace( this.props.width, this.props.height )
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.width !== this.state.width || nextProps.height !== this.state.height ) {
        this.calcWorkSpace( nextProps.width, nextProps.height )
    }
  }

  calcWorkSpace( width, height ) {
    this.setState( { 
      height,
      width,
      workspaceHeight: ( height || 0 ) * 0.5, // 70% of screenheight
      workspaceWidth: ( width || 0 ) * 0.9 // 90% of screenwidth
    } )
  }

  getAvailableLetters() {
     const { level, subdivision } = this.props

     if( subdivision === 'Triplets' ) {
        if( level === 'All' ) {
            return _.keys( TRIPLET_LETTERS )
        }

        return TRIPLET_LETTERS_LEVELS[ level.toLowerCase() ]
     } else {
        if( level === 'All' ) {
            return _.keys( LETTERS )
        }

        return LETTERS_LEVELS[ level.toLowerCase() ]
     }
  }

  genRandom( currentLetter ) {
      const letterKeys = this.getAvailableLetters()

      let letterkey = letterKeys[ _.random( letterKeys.length - 1 ) ]

      if( letterkey === currentLetter ) {
          return this.genRandom( currentLetter )
      }

      return letterkey
  }

  generateBeat( voice, refresh ) {
      const letterKeys = this.getAvailableLetters()

      let letterkey = letterKeys[ _.random( letterKeys.length - 1 ) ]


      let newHiHatLetter = 'A'
      if( voice === 'hihat' ) { 
        letterkey = refresh ? this.genRandom( this.state.hihatLetter ) : this.state.hihatLetter
        newHiHatLetter = letterkey
      }

      let newKickLetter = 'A'
      if( voice === 'kick' ) {
        letterkey = refresh ? this.genRandom( this.state.kickLetter ) : this.state.kickLetter
        newKickLetter = letterkey
      }

      const USE_LETTERS = this.props.subdivision === 'Triplets' ? TRIPLET_LETTERS : LETTERS
      const USE_LETTER = USE_LETTERS[ letterkey ]

      let groups = [];
      const beams = [];

      const position = voice === 'hihat' ? 'f/5' : 'd/4'

      for( let i = 1; i <= 4; i++ ) {
          const values = USE_LETTER.values

          let containsRest = false
          const tmp = values.map( ( x, v ) => {
            containsRest = x.indexOf( 'r' ) > -1 ? true : false
            const type = containsRest || voice === 'kick' ? '' : '/x2'
            let key = [ `${ position }${ type }` ]

            if( voice !== 'kick' ) {
              if( ( i === 2 || i === 4 ) && v === 0 ) {
                  // add backbeat
                  if( containsRest ) {
                      x = x.substring( 0, x.length - 1 )
                      key = [ "a/4" ]
                  } else {
                      key = [ ...key, "a/4" ]
                  }
              }
            }

            const t = new StaveNote( { clef: "percussion", keys: key, duration: x, stem_direction: voice === 'kick' ? -1 : 1 } );

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

      return { groups, beams, newHiHatLetter, newKickLetter }
  }

  runVexFlowCode(context, width, height, type) {
    const stave = new Stave(0, 0, Math.round( width ) - 1 );
    stave.setContext(context);
    stave.setClef('percussion');
    stave.setTimeSignature('4/4');
    stave.draw();

    const BEAT_VALUE = this.props.subdivision === '16th notes' ? 4 : 3

    const refreshHiHat = type === 'hihat' || type === 'all'
    const hihatBeat = this.generateBeat( 'hihat', refreshHiHat )
    const { beams, groups } = hihatBeat
    const allNotes = groups

    const voice = new Voice({num_beats: 4,  beat_value: BEAT_VALUE});
    voice.addTickables(allNotes);


    const refreshKick = type === 'kick' || type === 'all'
    const kickBeat = this.generateBeat( 'kick', refreshKick )
    const voice2 = new Voice({num_beats: 4,  beat_value: BEAT_VALUE});
    voice2.addTickables(kickBeat.groups);

    const formatter = new Formatter().joinVoices([voice, voice2]).formatToStave([voice, voice2], stave);
    voice.draw(context, stave);
    
    voice2.draw(context, stave);
    
    beams.forEach(function(b) {b.setContext(context).draw()})
    kickBeat.beams.forEach(function(b) {b.setContext(context).draw()})

    if( type === 'all' ) {
        this.setState( { hihatLetter: hihatBeat.newHiHatLetter, kickLetter: kickBeat.newKickLetter } )
    }

    if( type === 'hihat' ) {
      this.setState( { hihatLetter: hihatBeat.newHiHatLetter } )
    }

    if( type === 'kick' ) {
      this.setState( { kickLetter: kickBeat.newKickLetter } )
    }
  }


  generate( type ) {
      const { workspaceWidth, workspaceHeight } = this.state

      const context = new ReactNativeSVGContext(NotoFontPack, { width: workspaceWidth, height: workspaceHeight });
      this.runVexFlowCode(context, workspaceWidth, workspaceHeight, type);

      this.setState( { context } ) 
  }

  render() {
    const { workspaceWidth, workspaceHeight } = this.state

    if( !workspaceWidth && !workspaceHeight || ( workspaceHeight === 0 || workspaceWidth === 0 ) ) {
      return null
    }

    const { context } = this.state

    return (
      <View>
        <View>
            { context && context.render() }
        </View>

        { !context && ( <View style={ { height: workspaceHeight, justifyContent: 'center', alignItems: 'center' } }>
            <Text style={ { fontSize: 20, color: '#ccc' } }>Tap "New Groove" to start generating grooves!</Text>
        </View> ) }

        <View style={ { width: workspaceWidth, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 50, alignSelf: 'stretch' } }>
              <TouchableOpacity style={ styles.button } onPress={ () => this.generate( 'all' ) }>
                <Text style={ styles.buttonText }>New Groove</Text>
              </TouchableOpacity>

              { context && ( <TouchableOpacity style={ styles.button } onPress={ () => this.generate( 'hihat' ) }>
                <Text style={ styles.buttonText }>New HiHat Pattern</Text>
              </TouchableOpacity> ) }

              { context && ( <TouchableOpacity style={ styles.button } onPress={ () => this.generate( 'kick' ) }>
                <Text style={ styles.buttonText }>New Kick Pattern</Text>
              </TouchableOpacity> ) }
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

  button: {
    width: 150, 
    height: 40, 
    backgroundColor: '#fff', 
    borderColor: '#ccc', 
    borderWidth: .5,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666'
  }
});