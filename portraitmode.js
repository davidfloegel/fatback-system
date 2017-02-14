import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class PortraitMode extends Component {
    render() {
        return (
            <View style={ { marginTop: -50, flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 } }>
                <Icon name="rotate-left" size={ 80 } color='#ccc' />

                <Text style={ { fontSize: 20, fontWeight: 'bold', marginVertical: 20 } }>Rotate your Device</Text>

                <Text style={ { textAlign: 'center', fontSize: 16 } }>
                    Please rotate your device to view grooves. This section is only available in landscape mode!
                </Text>
            </View>
        )
    }
}