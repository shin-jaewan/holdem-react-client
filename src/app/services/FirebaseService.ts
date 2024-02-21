import { QueryConstraint, WhereFilterOp, addDoc, collection, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc, where } from '@firebase/firestore'
import { initializeApp } from '@firebase/app'
import { Auth, User, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { IBase } from '@model/BaseModel';

// console.log(process.env.REACT_APP_FIREBASE_APIKEY)
// const firebaseConfig = {
//     apiKey: env.REACT_APP_FIREBASE_APIKEY,
//     authDomain: env.REACT_APP_FIREBASE_AUTHDOMAIN,
//     projectId: env.REACT_APP_FIREBASE_PROJECTID,
//     storageBucket: env.REACT_APP_FIREBASE_STORAGEBUCKET,
//     messagingSenderId: env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
//     appId: env.REACT_APP_FIREBASE_APPID,
//     measurementId: env.REACT_APP_FIREBASE_MEASUREMENTID
// };

export type CollectionType =
    "HOSTS" |
    "GUESTS" |
    "GAMES" |
    "STORES"

export const HOST_COLLECTION_NAME: CollectionType = "HOSTS"
export const GUEST_COLLECTION_NAME: CollectionType = "GUESTS"
export const GAME_COLLECTION_NAME: CollectionType = "GAMES"
export const STORE_COLLECTION_NAME: CollectionType = "STORES"

const firebaseConfig = {
    apiKey: "AIzaSyCsTGaZw0LmPkIocuuIC-_57zJ0uNLgFh4",
    authDomain: "holdem-d0fa2.firebaseapp.com",
    projectId: "holdem-d0fa2",
    storageBucket: "holdem-d0fa2.appspot.com",
    messagingSenderId: "869520501770",
    appId: "1:869520501770:web:abb14d1e8594ce91a5c3f3",
    measurementId: "G-3TLQTNWJPG"
};

const app = initializeApp(firebaseConfig);

export const FirebaseStore = () => {
    const db = getFirestore(app)

    const upsert = async <T extends IBase>(path: CollectionType, data: T): Promise<T> => {
        try {
            if (data.id) {
                data.updatedAt = new Date()
                await setDoc(doc(db, path, data.id), data)
            } else {
                data.createdAt = new Date()
                data.updatedAt = new Date()

                const docRef = await addDoc(collection(db, path), data)
                data.id = docRef.id
                await setDoc(doc(db, path, data.id), data)
            }

            return data
        } catch (e) {
            return null
        }
    }

    const findOneById = async <T>(path: CollectionType, id: string): Promise<T> => {
        try {
            const docRef = doc(db, path, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                data.id = docSnap.id;

                return data as T
            } else {
                return null
            }

        } catch (e) {
            console.error(e)
            return null
        }
    }

    const searchAll = async <T>(path: CollectionType, constraints: Array<QueryConstraint>): Promise<Array<T>> => {
        try {
            const q = query(collection(db, path), ...constraints)
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(item => {
                const data = item.data();
                data.id = item.id;
                // console.log(item.id, " => ", item.data());

                return data as T
            })
        } catch (e) {
            return []
        }
    }


    return { upsert, findOneById, searchAll }
}

export const FirebaseAuth = () => {
    let auth: Auth = null

    try {
        auth = getAuth();
    } catch (e) {
        console.log(e);
    }

    const signUp = async (email: string, password: string): Promise<User> => {
        return new Promise<User>(async (resolve, reject) => {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    resolve(user)
                })
                .catch((error) => {
                    console.error(error)
                    resolve(null)
                });
        })
    }

    const login = async (id: string, password: string): Promise<User> => {
        return new Promise(async (resolve, reject) => {
            signInWithEmailAndPassword(auth, id, password)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    console.log("signInWithEmailAndPassword", user)
                    resolve(user)

                })
                .catch((error) => {
                    console.error(error)
                    resolve(null)
                });
        })
    }

    const singOut = async (): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            signOut(auth).then(() => {
                // Sign-out successful.
                resolve(true)
            }).catch((error) => {
                // An error happened.
                resolve(false)
            });
        })
    }

    return { signUp, login, singOut }
}