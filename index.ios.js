import _ from 'lodash'
import React, { Component } from 'react';
import { Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height, width } = Dimensions.get( 'window' )

const MUSO_MAIN = '#898CFF'

import PracticeView from './practice'
import PortraitAlert from './portraitmode'
import SettingsView from './settings'


export default class FatbackSystem extends Component {
  constructor(props) {
    super(props);

    this.state = {
        route: 'practice' // [ practice, settings ]
    }
  }

  renderHeader() {
      const { route } = this.state

      return (
          <View style={ styles.header }>
            <View style={ [ styles.headerAside, styles.headerLeft ] }>
              { route === 'settings' && ( <TouchableOpacity onPress={ () => this.setState( { route: 'practice' } ) }>
                <Icon name="arrow-left" size={ 20 } color={ MUSO_MAIN } />
              </TouchableOpacity> ) }
            </View>
            <View style={ styles.headerTitle }>
              <Text style={ styles.title }>{ route === 'settings' ? 'Settings' : 'The Fatback System' }</Text>
            </View>
            <View style={ [ styles.headerAside, styles.headerRight ] }>
              { route === 'practice' && ( <TouchableOpacity onPress={ () => this.setState( { route: 'settings' } ) }>
                <Icon name="cog" size={ 20 } color={ MUSO_MAIN } />
              </TouchableOpacity> ) }
            </View>
          </View>
      )
  }

  renderContent() {
      const { route, orientation } = this.state

      if( route === 'practice' ) {
          if( orientation === 'PORTRAIT' ) {
              return <PortraitAlert />
          }

          return <PracticeView />
      }

      if( route === 'settings' ) {
        return <SettingsView />
      }
  }

  onLayout( e ) {
    const { width, height } = e

    const orientation = (width > height) ? 'LANDSCAPE' : 'PORTRAIT';
    this.setState( { orientation } )
  }

  render() {
    _onLayout = e => this.onLayout( e.nativeEvent.layout )

    return (
      <View style={styles.container} onLayout={ e => _onLayout( e ) }>
        { this.renderHeader() }

        
        { this.renderContent() }
        

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
    alignItems: 'center',
    backgroundColor: '#f9f9f9'
  },
  footerText: {
    fontSize: 10,
    color: '#ccc',
    paddingVertical: 10
  }
});

AppRegistry.registerComponent('ReactNativeVexFlow', () => FatbackSystem);
