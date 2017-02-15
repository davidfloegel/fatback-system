import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsList from 'react-native-settings-list';

export default class Settings extends Component {
    renderList( key, list, active ) {
        return list.map( m => {
            return this.renderItem( key, m, m === active, m )
        } )
    }

    renderItem( setting, key, active, title ) {
        return ( <SettingsList.Item
            onPress={ () => this.props.onChangeSettings( setting, title ) }
            key={ key }
            icon={ <Icon name="check" size={ 20 } style={ { paddingTop: 14, paddingLeft: 14 } } color={ active ? '#898CFF' : '#efefef' } /> }
            title={ title }
            hasNavArrow={ false } /> )
    }

    render() {
        return (
            <View style={ { flex: 1, alignSelf: 'stretch', paddingBottom: 40 } }>
                <SettingsList borderColor={ '#ccc' }>
                    <SettingsList.Header headerText='Difficulty Mode' />
                    { this.renderList( 'level', [ 'Easy', 'Medium', 'Hard', 'All' ], this.props.level ) }

                    <SettingsList.Header headerText='Subdivision' headerStyle={ { marginTop: 30 } } />
                    { this.renderList( 'subdivision', [ '16th notes', 'Triplets' ], this.props.subdivision ) }
                </SettingsList>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    list: {
        borderTopWidth: .5,
        borderTopColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
        alignSelf: 'stretch'
    },
    item: {
        borderTopWidth: .5,
        borderTopColor: '#ccc',
        height: 50,
        alignSelf: 'stretch'
    }
});