import React, { useContext, useState } from 'react'
import { View, ImageBackground, Alert } from 'react-native';
import { signOut } from "../../database/fbActions";
import { useForm, Controller } from "react-hook-form";
import { isValidUserName, updateUserInfo } from '../../database/fbActions';
import { userContext } from '../userContext/UserState';
import { Text, Button, Input } from '@ui-kitten/components';
import { styles } from '../styles/UserDetails.styles';
import i18n from 'i18n-js';

const UserDetails = () => {
    const { state, setLogOut, updateUser } = useContext(userContext);
    const [enableEdit, setEnableEdit] = useState(false)
    const { user } = state;
    const { control, handleSubmit, errors } = useForm();


    const handlePress = async () => {
        const a = await signOut();
        a ? setLogOut() : Alert.alert(i18n.t('error'));
    }

    const handleOnUpdate = async (form) => {

        if (user.userName !== form.userName || user.name !== form.name) {
            const newUserName = user.userName !== form.userName
                ? await isValidUserName(form.userName)
                    ? form.userName
                    : Alert.alert(i18n.t('userExists'))
                : user.userName;


            const newName = user.name !== form.name ? form.name : user.name;
            update(newName, newUserName)
        } else {
            Alert.alert(i18n.t('dontChange'));
        }
    }

    const checkUpdate = (value, key) => {
        user[key] !== value ? setEnableEdit(true) : null
    }

    const update = async (name, userName) => {
        const a = await updateUserInfo(user.id, name, userName);
        a ? updateUserContext(name, userName) : Alert.alert(i18n.t('error'));
    }

    const updateUserContext = (name, userName) => {
        updateUser(name, userName);
        Alert.alert(i18n.t('userUpdated'))
    }

    const onSubmit = (data) => {
        handleOnUpdate(data);
    }

    const onError = (errors, e) => console.log(errors);

    return (
        <ImageBackground
            source={require('../assets/nmc2.png')}
            style={styles.background}
            resizeMode="stretch"
        >
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <Input
                                    placeholder={i18n.t('name')}
                                    onChangeText={(value) => { onChange(value); checkUpdate(value, 'name') }}
                                    onBlur={onBlur}
                                    value={value}
                                    status={errors.name ? 'danger' : null}
                                />
                            )}
                            name="name"
                            rules={{ required: { value: true, message: i18n.t('fieldRequired') }, minLength: { value: 3, message: i18n.t('minLength') } }}
                            defaultValue={user.name}
                        />
                        {errors.name && <Text status="danger">{errors.name.message}</Text>}
                    </View>
                    <View style={styles.input}>
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => (
                                <Input
                                    placeholder={i18n.t('nickName')}
                                    onChangeText={(value) => { onChange(value); checkUpdate(value, 'userName') }}
                                    onBlur={onBlur}
                                    value={value}
                                    status={errors.userName ? 'danger' : null} />
                            )}
                            name="userName"
                            rules={{ required: { value: true, message: i18n.t('fieldRequired') }, minLength: { value: 3, message: i18n.t('minLength') } }}
                            defaultValue={user.userName}
                        />
                        {errors.userName && <Text status="danger">{errors.userName.message}</Text>}
                    </View>
                </View>
                <View style={styles.button}>
                    <Button
                        onPress={handleSubmit(onSubmit, onError)}
                        title="Update"
                        color="#841584"
                        accessibilityLabel="Update"
                        disabled={!enableEdit}
                    >
                        {i18n.t('update')}
                    </Button>
                </View>

                <View style={styles.button}>
                    <Button
                        onPress={handlePress}
                        title="Sign out"
                        color="#841584"
                        accessibilityLabel="Sign out from aplication"
                        appearance='ghost'
                        status='danger'
                    >
                        {i18n.t('signOut')}
                    </Button>
                </View>
            </View>
        </ImageBackground>
    )
}

export default UserDetails
