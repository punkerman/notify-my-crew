import { Platform } from 'react-native'
import * as Notifications from "expo-notifications";
import { setExpoPushToken, getUserById } from "./fbActions";

export const registerForPushNotifications = async (userId) => {
    try {
        const permission = await Notifications.getPermissionsAsync()
        if (!permission.granted) return;
        const token = await Notifications.getExpoPushTokenAsync();
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
        setExpoPushToken(userId, token.data)
    } catch (error) {
        console.log('Error getting a token', error);
    }
}

export const sendPushNotification = async (targetId, message) => {
    const { expoPushToken, userName } = await getUserById(targetId);
    fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "to": expoPushToken,
            "title": `Hi ${userName}`,
            "body": message
        })
    })
        .then(res => console.log('res', JSON.stringify(res._bodyBlob)))
        .catch(error => console.log(error));
}

export const sendPushNotificationToCrew = async (crewMembers, message) => {
    crewMembers.forEach((crewMember) => {
        sendPushNotification(crewMember.id, message)
    })
}