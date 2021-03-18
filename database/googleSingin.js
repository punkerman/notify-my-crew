import * as Google from "expo-google-app-auth";

export const onGoogleButtonPress = async (navigation) => {
    try {
        const { type, user, idToken } = await Google.logInAsync({
            iosClientId: ``,
            androidClientId: ``
        });
        if (type === "success") {
            navigation.navigate("Register", { user, idToken });
        }
    } catch (error) {
        console.log("error with login", error);
    }
};
