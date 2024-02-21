import { getAuth, onAuthStateChanged, updateProfile } from "@firebase/auth"
import { CollectionType, FirebaseStore } from "./FirebaseService"
import { GameModel } from "@model/GameModel"
import { orderBy } from "@firebase/firestore"

export namespace StoreService {
    const STORE_COLLECTION: CollectionType = "STORES"
    const { upsert, searchAll, findOneById } = FirebaseStore()

    export const HOST = {
        store: async (id: string): Promise<GameModel.IGame> => {
            try {
                return await findOneById<GameModel.IGame>(STORE_COLLECTION, id)
            } catch (e) {
                console.log(e);
                return null;
            }
        },
        list: async (): Promise<Array<GameModel.IGame>> => {
            try {
                return await searchAll<GameModel.IGame>(STORE_COLLECTION, [orderBy("createdAt", "desc")])
            } catch (e) {
                console.log(e);
                return [];
            }
        },
    }

    export const Host = {
        create: async (model: GameModel.IGame): Promise<GameModel.IGame> => {
            try {
                return await upsert<GameModel.IGame>(STORE_COLLECTION, model)
            } catch (e) {
                console.log(e);
                return null;
            }
        }
    }

    export const Guest = {
        registration: async () => {
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
        }
    }
}
