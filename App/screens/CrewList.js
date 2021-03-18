import React, { useState, useContext, useEffect } from 'react'
import { View, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { userContext } from '../userContext/UserState';
import { addCrewMember, deleteCrewMember as delCrewMember } from "../../database/fbActions";
import { Text, Button, Input } from '@ui-kitten/components';
import { sendPushNotification, sendPushNotificationToCrew } from '../../database/pushNotifications';
import { styles } from '../styles/CrewList.styles';
import { Modal, ListItem, Icon, Spinner } from '@ui-kitten/components';
import i18n from 'i18n-js';

const CrewList = ({ route }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [crewMembers, setCrewMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { state, updateCrewMembers, deleteCrewMember } = useContext(userContext);
    const { control, handleSubmit, errors } = useForm();
    const { game } = route.params;
    const { user } = state;

    const handleNotifyCrew = () => {
        sendPushNotificationToCrew(user.games[game.id], `${user.userName} wants you to join ${game.name}`)
    }

    useEffect(() => {
        setCrewMembers(user.games[game.id]);
    }, [])

    useEffect(() => {
        setCrewMembers(user.games[game.id]);
        setLoading(false);
    }, [user.games[game.id]]);

    const handleClick = () => {
        setModalOpen(true);
    }

    const handleOnDelete = async (crewMember) => {
        setLoading(true);
        const deleted = await delCrewMember(user.id, game.id, crewMember);
        deleted.valid ? deleteCrewMember(game.id, crewMember) : null;
    }

    const handleAddCrewMember = async (userName) => {
        setLoading(true);
        const { valid, id } = await addCrewMember(game.id, user.id, userName);
        if ({ valid }) {
            setModalOpen(false);
            sendPushNotification(id, `${user.userName} ${i18n.t('addedAs')} ${game.name} ${i18n.t('crewMember')}`);
            updateCrewMembers({ gameID: game.id, crewMember: { id: id, name: userName } });
        } else {
            Alert.alert(i18n.t('errorFindingUser'))
        }
    }

    const onSubmit = (data) => {
        handleAddCrewMember(data.userName);
    }

    const onError = (errors, e) => console.log(errors);

    const renderIcon = (props) => (<Icon {...props} name={props.name} />);

    const renderItemAccessory = (crewMember) => (
        <Button
            size='small'
            status='danger'
            accessoryLeft={(props) => renderIcon({ ...props, name: 'trash' })}
            onPress={() => handleOnDelete(crewMember)} />
    );

    const renderItem = ({ item, index }) => (
        <ListItem
            title={item.name}
            accessoryLeft={(props) => renderIcon({ ...props, name: 'person' })}
            accessoryRight={() => renderItemAccessory(item)}
            style={{ height: 70 }}
        />
    );

    const emptyList = () =>
        (<Text>{i18n.t('noCrewMembers')}</Text>);

    return (
        <View style={styles.container}>
            <Modal
                backdropStyle={styles.backdrop}
                visible={modalOpen}
                onBackdropPress={() => setModalOpen(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.input}>
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <Input
                                        placeholder={i18n.t('userAlias')}
                                        onChangeText={(value) => onChange(value)}
                                        onBlur={onBlur}
                                        value={value} />
                                )}
                                name="userName"
                                rules={{ required: { value: true, message: 'field required' }, minLength: { value: 3, message: 'should contain at least 3 characters' } }}
                                defaultValue=""
                            />
                            {errors.userName && <Text style={styles.text}>{errors.userName.message}</Text>}
                        </View>
                        <Button
                            onPress={handleSubmit(onSubmit, onError)}
                            title="Add Crew member"
                            color="#841584"
                            accessibilityLabel=""
                        > {i18n.t('addCreWMember')}</Button>
                    </View>
                </View>
            </Modal>

            <View >
                <Text>{game.name}</Text>
                <Button
                    onPress={() => handleNotifyCrew()}
                    title="Notify crew"
                    status='success'
                    accessibilityLabel="Notify crew"
                    disabled={crewMembers === undefined || crewMembers.length === 0}
                >
                    {i18n.t('notifyMyCrew')}</Button>
            </View>
            {loading ?
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Spinner size='giant' />
                </View>
                :
                <View style={{ flex: 2 }}>
                    <FlatList
                        key={crewMembers !== undefined ? crewMembers.length : 0}
                        style={styles.container}
                        data={crewMembers}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        extraData={crewMembers}
                        ListEmptyComponent={emptyList}

                    />
                </View>
            }
            <View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleClick()}
                    style={styles.touchableOpacityStyle}>
                    <Image
                        source={require('../assets/plus.png')}
                        style={styles.floatingButtonStyle}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CrewList

