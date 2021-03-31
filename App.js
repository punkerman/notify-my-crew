import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { decode, encode } from 'base-64';
import firebase from "./database/firebase";
import { StateProvider, userContext } from './App/userContext/UserState';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { translations } from './App/helpers/translations';
import MyStack from './App/helpers/NavigationStack';
import { registerForPushNotifications } from "./database/pushNotifications";
import * as Localization from 'expo-localization';
import * as eva from '@eva-design/eva';
import i18n from 'i18n-js';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

i18n.translations = translations;
i18n.locale = Localization.locale;
i18n.fallbacks = true;

const WithGlobalContext = ChildComponent => props => (
  <userContext.Consumer>
    {
      context => <ChildComponent {...props} global={context} />
    }
  </userContext.Consumer>
);

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