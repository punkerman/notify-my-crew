import React, { useContext } from 'react'
import { View, Alert } from 'react-native';
import { useForm, Controller } from "react-hook-form";
import { createUser, isValidUserName, createFirebaseUser } from '../../database/fbActions';
import { userContext } from '../userContext/UserState';
import { styles } from '../styles/RegisterScreen.styles'
import { Input, Text, Button } from '@ui-kitten/components';
import i18n from 'i18n-js';


const RegisterScreen = ({ route }) => {
    const { setUser } = useContext(userContext);
    const { control, handleSubmit, errors } = useForm();
    const { user } = route.params;

    const handleOnSave = async (form) => {
        const isUserNamePicked = await isValidUserName(form.userName);
        !isUserNamePicked ? addUser(form) : Alert.alert(i18n.t('errorTitle'), i18n.t('userExists'));
    }

    const addUser = async (formData) => {
        const { password, ...userInfo } = formData
        const uid = await createFirebaseUser(userInfo.email, password)
        const userCreated = await createUser(userInfo, uid);
        userCreated ? setUser({ ...userInfo, id: uid }) : Alert.alert(i18n.t(i18n.t('errorTitle'), 'errorCreatingUser'));
    };

    const onSubmit = (data) => {
        handleOnSave(data);
    }

    const onError = (errors, e) => console.log(errors.email);

    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <Input
                            placeholder={i18n.t('name')}
                            onChangeText={(value) => onChange(value)}
                            onBlur={onBlur}
                            value={value}
                            status={errors.name ? 'danger' : null}
                        />
                    )}
                    name="name"
                    rules={{ required: { value: true, message: i18n.t('fieldRequired') }, minLength: { value: 3, message: i18n.t('minLength') } }}
                    defaultValue={user ? user.name : ''}
                />
                {errors.name && <Text status="danger">{errors.name.message}</Text>}
            </View>
            <View style={styles.input}>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <Input
                            placeholder={i18n.t('email')}
                            onChangeText={(value) => onChange(value)}
                            onBlur={onBlur}
                            textContentType="emailAddress"
                            value={value}
                            status={errors.email ? 'danger' : null}
                        />
                    )}
                    name="email"
                    rules={{ required: { value: true, message: i18n.t('fieldRequired') }, pattern: { value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i, message: i18n.t('validEmail') } }}
                    defaultValue={user ? user.email : ''}
                />
                {errors.email && <Text status="danger">{errors.email.message}</Text>}
            </View>
            <View style={styles.input}>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <Input
                            placeholder={i18n.t('password')}
                            onChangeText={(value) => onChange(value)}
                            onBlur={onBlur}
                            textContentType="password"
                            secureTextEntry={true}
                            value={value}
                            status={errors.password ? 'danger' : null}
                        />
                    )}
                    name="password"
                    rules={{ required: { value: true, message: i18n.t('fieldRequired') }, pattern: { value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, message: i18n.t('passwordValidation') } }}
                    defaultValue=""
                />
                {errors.password && <Text status="danger">{errors.password.message}</Text>}
            </View>
            <View style={styles.input}>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                        <Input
                            placeholder={i18n.t('nickName')}
                            onChangeText={(value) => onChange(value)}
                            onBlur={onBlur}
                            value={value}
                            status={errors.userName ? 'danger' : null}
                        />
                    )}
                    name="userName"
                    rules={{ required: { value: true, message: i18n.t('fieldRequired') }, minLength: { value: 3, message: i18n.t('minLength') } }}
                    defaultValue=""
                />
                {errors.userName && <Text status="danger">{errors.userName.message}</Text>}
            </View>

            <View style={styles.button}>
                <Button
                    onPress={handleSubmit(onSubmit, onError)}
                    title="Register"
                    color="#841584"
                    accessibilityLabel="register"
                >
                    {i18n.t('register')}
                </Button>
            </View>

        </View>
    )
}

export default RegisterScreen
