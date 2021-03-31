import firebase from "./firebase";

export const isValidUserName = async (userName) => {
    let res;
    await firebase.db.collection('users').where("userName", "==", String(userName))
        .get()
        .then((querySnapshot) => {
            res = querySnapshot.docs.length > 0 ? querySnapshot.docs[0].id : false;
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    return res;
}

export const createUser = (userInfo, uid) => {
    userInfo.games = [];
    const created = firebase.db.collection('users').doc(uid).set(userInfo)
        .then(() => { return true })
        .catch((error) => { console.log(error); return false; });
    return created
}

export const getGames = async () => {
    const images = [];
    await firebase.db.collection('games')
        .get()
        .then((querySnapshot) => {
            querySnapshot.docs.forEach(doc => {
                images.push({ ...doc.data(), id: doc.id });
            });
        });
    return images;
}

export const createFirebaseUser = async (email, password) => {
    let uid;
    await firebase.firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
            uid = res.user.uid;
            console.log(res.user.uid, 'User account created & signed in!');
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            console.error(error);
        });
    return uid;
}

export const loginUser = async (email, password) => {
    let user;
    await firebase.firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (response) => {
            const uid = response.user.uid;
            await firebase.db.collection('users')
                .doc(uid)
                .get()
                .then(firestoreDocument => {
                    if (!firestoreDocument.exists) {
                        user = { error: true, errorMessage: "User does not exist anymore." };
                    }
                    console.log(`firebaseDocument++++`, firebaseDocument);
                    user = { ...firestoreDocument.data(), error: false };
                })
                .catch(error => {
                    console.log(error)
                    user = { error: true, errorMessage: error };
                });
        })
        .catch(error => {
            user = { error: true, errorMessage: error };
        });
    return user;
}

export const signOut = async () => {
    let success = false
    await firebase.firebase
        .auth().signOut().then(() => {
            success = !success;
        });
    return success
}

export const updateUserInfo = async (userId, user, userName) => {
    let success = false
    await firebase.db.collection('users').doc(userId)
        .update({
            'name': user,
            'userName': userName
        })
        .then(() => {
            success = true;
        })
        .catch(error => {
            console.log(error)
        });;
    return success;
}

export const addCrewMember = async (gameId, userId, newCrewMemberId) => {
    let a;
    const validId = await isValidUserName(newCrewMemberId);
    if (validId) {
        await firebase.db.collection('users').doc(userId).
            update({
                [`games.${gameId}`]: firebase.firebase.firestore.FieldValue.arrayUnion({ id: validId, name: newCrewMemberId })
            })
            .then(() => { a = { valid: true, id: validId }; })
            .catch(error => {
                a = { valid: false, id: null };
                console.log(error)
            });
    }
    return a;
}

export const setExpoPushToken = async (userId, expoToken) => {
    await firebase.db.collection('users').doc(userId).
        update({
            "expoPushToken": expoToken
        })
        .then(() => console.log('expor token added'))
        .catch(error => {
            console.log(error)
        });
}

export const getUserById = async (userId) => {
    let user = {};
    await firebase.db.collection('users').doc(userId)
        .get()
        .then((querySnapshot) => {
            user = querySnapshot.data();
        });
    return user;
}

export const getCrewMembers = async (userId, gameId) => {
    let crewMembers = [];
    await firebase.db.collection('users').doc(userId).get()
        .then((querySnapshot) => {
            console.log('querySnapshot', querySnapshot.data());
            crewMembers = Object.keys(querySnapshot.data()).length > 0 ?
                querySnapshot.data().games[gameId] : false;
        })
    return crewMembers;
}

export const deleteCrewMember = async (userId, gameId, crewMember) => {
    let res = {}
    await firebase.db.collection('users').doc(userId)
        .update({
            [`games.${gameId}`]: firebase.firebase.firestore.FieldValue.arrayRemove(crewMember)
        })
        .then(() => { res = { valid: true }; });
    return res;
}