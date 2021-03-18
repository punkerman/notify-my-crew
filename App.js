import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from './App/screens/HomeScreen';
import RegisterScreen from './App/screens/RegisterScreen';
import UserCrews from "./App/screens/UserCrews";
import UserDetails from "./App/screens/UserDetails"
import CrewList from "./App/screens/CrewList"
import LogoTitle from "./App/components/Header";
import { decode, encode } from 'base-64';
import firebase from "./database/firebase";
import { StateProvider, userContext } from './App/userContext/UserState';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { translations } from './App/helpers/translations';
import { registerForPushNotifications } from "./database/pushNotifications";
import * as Localization from 'expo-localization';
import * as eva from '@eva-design/eva';
import i18n from 'i18n-js';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

i18n.translations = translations;
i18n.locale = Localization.locale;
i18n.fallbacks = true;

const Stack = createStackNavigator();

const WithGlobalContext = ChildComponent => props => (
  <userContext.Consumer>
    {
      context => <ChildComponent {...props} global={context} />
    }
  </userContext.Consumer>
);

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

function Main() {
  const { state, setLoading, setUser } = useContext(userContext);
  const { loading } = state;

  useEffect(() => {
    firebase.firebase
      .auth().onAuthStateChanged((user) => {
        if (user) {
          firebase.db.collection('users')
            .doc(user.uid)
            .get()
            .then(async (document) => {
              const userSession = document.data();
              userSession.id = user.uid;
              await registerForPushNotifications(userSession.id);
              setLoading(false);
              setUser(userSession);
            })
            .catch((error) => {
              setLoading(false)
            });
        } else {
          setLoading(false)
        }
      });
  }, []);

  if (loading) {
    return (
      <></>
    )
  }
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
      </ApplicationProvider>
    </>

  )
}

export default function App() {
  const MainComponent = WithGlobalContext(Main)
  return (
    <StateProvider>
      <MainComponent />
    </StateProvider >)

}