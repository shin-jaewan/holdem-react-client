import { getAuth, onAuthStateChanged, updateProfile } from "@firebase/auth"
import { CollectionType, FirebaseAuth, FirebaseStore, HOST_COLLECTION_NAME } from "./FirebaseService";
import { UserModel } from "@model/UserModel";
import { where } from "@firebase/firestore";

export namespace UserService {
    const { searchAll } = FirebaseStore()
    const { singOut } = FirebaseAuth()

    export const Host = {
        profile: async (): Promise<UserModel.IHost> => {
            return new Promise((resolve, reject) => {
                try {
                    const auth = getAuth();
                    onAuthStateChanged(auth, async (user) => {
                        if (user && user.uid) {
                            const hosts = await searchAll<UserModel.IHost>(HOST_COLLECTION_NAME, [where("uid", "==", user.uid)])
                            const host = hosts.find(item => item.uid == user.uid)
                            resolve(host)
                        }
                        resolve(null)
                    });
                } catch (e) {
                    console.log(e);
                    resolve(null)
                }
            })
        },
        singOut: async (): Promise<boolean> => {
            return new Promise(async (resolve, reject) => {
                const user = await singOut()
                return resolve(true)
            })
        },
    }

    export const Guest = {
        profile: async () => {
            return new Promise((resolve, reject) => {
                try {
                    const auth = getAuth();
                    onAuthStateChanged(auth, (user) => {
                        console.log(user);
                        resolve(user)
                    });
                } catch (e) {
                    console.log(e);
                    resolve(null)
                }
            })
        },
    }
}

