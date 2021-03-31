import React from 'react'
import { ImageBackground, View, Alert } from 'react-native'
import { onGoogleButtonPress } from '../../database/googleSingin';
import { useForm, Controller } from "react-hook-form";
import { loginUser } from "../../database/fbActions";
import { styles } from '../styles/HomeScreen.styles';
import { Input, Text, Button } from '@ui-kitten/components';
import i18n from 'i18n-js';


const HomeScreen = ({ navigation }) => {
    const { control, handleSubmit, errors } = useForm();

    const handleGoogleLogin = () => {
        onGoogleButtonPress(navigation);
    }

    const handleRegister = () => {
        const user = { name: "", email: '' }
        navigation.navigate('Register', { user });
    }

    const onSubmit = (data) => {
        onLogin(data);
    }

    const onError = (errors, e) => console.log(errors);


    const onLogin = async ({ email, password }) => {
        const userInfo = await loginUser(email, password);
        userInfo.error ? Alert.alert(i18n.t('errorTitle'), i18n.t('wrongLogin')) : false;
    }

    return (
        <ImageBackground
            source={require('../assets/nmc4.png')}
            style={styles.background}
            resizeMode="stretch"
        >
            <View style={styles.container}>
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
                        defaultValue=""
                    />
                    {errors.email && <Text status="danger" >{errors.email.message}</Text>}
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
                        rules={{ required: { value: true, message: i18n.t('fieldRequired') } }}
                        defaultValue=""
                    />
                    {errors.password && <Text status="danger">{errors.password.message}</Text>}
                </View>
                <Button
                    onPress={handleSubmit(onSubmit, onError)}
                    title="Log in"
                    color="#841584"
                    accessibilityLabel="save"
                    style={styles.button}
                >
                    {i18n.t('login')}
                </Button>

            </View>

            <View style={styles.buttons}>
                <Button
                    onPress={handleGoogleLogin}
                    title="Sign in with google"
                    accessibilityLabel="Log in with google"
                    style={styles.button}
                    appearance='outline'
                >
                    {i18n.t('googleSingUp')}
                </Button>
                <Button
                    onPress={handleRegister}
                    title="Register"
                    accessibilityLabel="Learn more about this purple button"
                    style={styles.button}
                    appearance='outline'
                >
                    {i18n.t('register')}
                </Button>
            </View>
        </ImageBackground>
    )
}

export default HomeScreen


