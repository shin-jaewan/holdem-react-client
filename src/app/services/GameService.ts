import { orderBy } from "@firebase/firestore"
import { CollectionType, FirebaseStore, GAME_COLLECTION_NAME, HOST_COLLECTION_NAME } from "./FirebaseService"
import { GameModel } from "@model/GameModel"
import { UserModel } from "@model/UserModel"
import { mode } from "crypto-js"

export namespace GameService {
    const { upsert, searchAll, findOneById } = FirebaseStore()

    export const ALL = {
        game: async (id: string): Promise<GameModel.IGame> => {
            try {
                return await findOneById<GameModel.IGame>(GAME_COLLECTION_NAME, id)
            } catch (e) {
                console.log(e);
                return null;
            }
        },
        list: async (): Promise<Array<GameModel.IGame>> => {
            try {
                return await searchAll<GameModel.IGame>(GAME_COLLECTION_NAME, [orderBy("createdAt", "desc")])
            } catch (e) {
                console.log(e);
                return [];
            }
        },
    }

    export const Host = {
        create: async (model: GameModel.IGame): Promise<GameModel.IGame> => {
            try {
                const game = await upsert<GameModel.IGame>(GAME_COLLECTION_NAME, model)
                const host = await findOneById<UserModel.IHost>(HOST_COLLECTION_NAME, model.hostId)
                if (!host.게임_아이디_리스트) {
                    host.게임_아이디_리스트 = []
                }

                host.게임_아이디_리스트.push(game.id)
                await upsert(HOST_COLLECTION_NAME, host)

                return game
            } catch (e) {
                console.log(e);
                return null;
            }
        },

        update: async (model: GameModel.IGame): Promise<GameModel.IGame> => {
            try {
                return await upsert<GameModel.IGame>(GAME_COLLECTION_NAME, model)
            } catch (e) {
                console.log(e);
                return null;
            }
        }
    }

    export const Guest = {
        apply: async (gameId: string, model: UserModel.IGuest): Promise<boolean> => {
            try {
                const game = await findOneById<GameModel.IGame>(GAME_COLLECTION_NAME, gameId)
                if (!game) {
                    return null
                }

                if (!game.참가자_목록) {
                    game.참가자_목록 = [];
                }

                game.참가자_목록.push(model)
                await upsert(GAME_COLLECTION_NAME, game)

                return true
            } catch (e) {
                console.log(e)
                return false
            }
        }
    }
}
