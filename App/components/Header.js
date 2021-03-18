import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { userContext } from '../userContext/UserState';
import { Avatar, Text } from '@ui-kitten/components';


const LogoTitle = ({ navigation }) => {
    const { state } = useContext(userContext);
    const { user } = state;

    const handleOnPress = () => {
        navigation.navigation.navigate('UserDetails')
    }

    return (
        <View style={styles.container}
        >
            <Text style={styles.playerName}
            >
                {user.userName}
            </Text>
            <TouchableOpacity onPress={handleOnPress} style={styles.avatarContainer}>
                <Avatar
                    style={styles.avatar}
                    source={require('../assets/icon.png')}
                />
            </TouchableOpacity>
        </View >
    );
}

export default LogoTitle

const styles = StyleSheet.create({
    container: {
        height: Platform.select({
            'android': 56,
            'default': 50,
        }),
        width: Dimensions.get('window').width + 5,
        left: Platform.select({
            'android': -16,
            'default': 0,
        }),
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "baseline",
        backgroundColor: 'rgb(21, 26, 48)'
    },
    playerName: {
        textAlign: "center",
        alignSelf: "center",
        width: 100,
        marginRight: 20
    },
    avatar: {
        width: 42,
        height: 42,
        right: 15,
    },
    avatarContainer: {
        justifyContent: "center",
        height: '100%'
    }
})