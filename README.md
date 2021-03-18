# NOTIFY MY CREW

Notify my crew is a project written in react native and built using expo. 

## Description

Notify my crew is an mobile aplication that allows users to add friends to a crew and send them notifications. A crew is basically a group of players sorted under a game. Users can send notification to its crew to let them know that is starting playing a game.

Push notifications only work on real devices, this means you can send push notification from your emulator and physical devices but only receive them in your physical device.

## Run the project 

Before run the project you need first a google account, and set up a firebase project and copy the keys generated.</br>
The files you need to modify in order to run the project are: </br>
* database/firebase.js
* database/googleSingin.ja
* app.json

After setting up the project run the commands

```
 $ npm install

 $ expo start
```
Don't want to set up the project and want to test it instead? You can download the APK file (only android) located in

`build/android/notify-my.crew.apk`

## Resources

* https://docs.expo.io/versions/latest/sdk/google-sign-in/
* https://firebase.google.com/docs/web/setup