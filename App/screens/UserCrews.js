import React, { useState, useEffect } from 'react'
import { View, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import { getGames } from '../../database/fbActions';
import { imagesUri } from "../helpers/gamesImagesUri";
import { styles } from '../styles/UserCrews.styles';

const UserCrews = ({ navigation }) => {

    const [gamesInfo, setGamesInfo] = useState([]);

    useEffect(() => {
        let isSubscribed = true
        const getgamesInfo = async () => {
            const gamesInfo = await getGames();
            isSubscribed
                ? setGamesInfo(gamesInfo)
                : null
        }
        getgamesInfo();
        return () => isSubscribed = false
    }, []);


    const displayCrewList = (game) => {
        navigation.navigate('CrewList', { game })
    }

    const renderItem = ({ item }) => {
        const backgroundColor = "#f9c2ff";
        return (
            <Item
                imageName={item.image}
                onPress={() => displayCrewList(item)}
                style={{ backgroundColor }}
            />
        );
    };

    return (
        <View style={styles.container}>
            {gamesInfo.length > 0
                ? < FlatList
                    data={gamesInfo}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
                : null}
        </View>
    )
}

const Item = ({ imageName, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
        <ImageBackground
            source={imagesUri[imageName].uri}
            style={styles.banner}
        >
        </ImageBackground>
    </TouchableOpacity>
);

export default UserCrews
