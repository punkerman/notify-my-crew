import React, { useContext } from 'react';
import { userContext } from '../userContext/UserState';
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserCrews from "../screens/UserCrews";
import UserDetails from "../screens/UserDetails"
import CrewList from "../screens/CrewList"
import LogoTitle from "../components/Header";
import i18n from 'i18n-js';

const Stack = createStackNavigator();

const MyStack = () => {
    const { state } = useContext(userContext);
    const { user } = state;
    return (<Stack.Navigator>
        {Object.keys(user).length > 0 ?
            <>
                <Stack.Screen name={i18n.t('myCrews')} component={UserCrews} options={(navigation) => ({ headerTitle: () => <LogoTitle navigation={navigation} /> })} />
                <Stack.Screen name="UserDetails" component={UserDetails} options={{ title: i18n.t('userDetails') }} />
                <Stack.Screen name="CrewList" component={CrewList} options={{ title: i18n.t('myCrew') }} />
            </>
            :
            <>
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: i18n.t('login') }} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </>
        }
    </Stack.Navigator>)
}

export default MyStack;