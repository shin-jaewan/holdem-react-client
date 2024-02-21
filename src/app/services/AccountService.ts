// import { FirebaseAuth } from "./FirebaseAuth"
import { CollectionType, FirebaseAuth, FirebaseStore, GUEST_COLLECTION_NAME, HOST_COLLECTION_NAME } from "./FirebaseService"
import { UserModel } from "@model/UserModel"
import { where } from "@firebase/firestore"

export namespace AccountService {
    const { signUp, login } = FirebaseAuth()
    const { upsert, findOneById, searchAll } = FirebaseStore()

    export const Host = {
        verifyEmail: async (email: string) => {
            return await findOneById(HOST_COLLECTION_NAME, email) ? true : false
        },

        signUp: async (model: UserModel.IHost): Promise<UserModel.IHost> => {
            try {
                // 기존에 가입되어 있는지 확인
                const hosts = await searchAll(HOST_COLLECTION_NAME, [where("email", "==", model.이메일)])
                if (hosts?.length > 0) {
                    console.log("email already exists!!")
                    return null
                }

                const user = await signUp(model.이메일, model.비밀번호)
                model.uid = user.uid

                // 사용자 프로필 저장
                const storedModel = await upsert(HOST_COLLECTION_NAME, model)
                return storedModel
            } catch (e) {
                console.log(e);
            }

            return null
        },

        login: async (email: string, password: string): Promise<UserModel.IHost> => {
            try {
                const host = await login(email, password)
                if (host) {
                    const hosts = await searchAll<UserModel.IHost>(HOST_COLLECTION_NAME, [where("uid", "==", host.uid)])
                    return hosts.find(item => item.uid == host.uid)
                }
            } catch (e) {
                console.log(e);
            }

            return null
        },
    }

    export const Guest = {
        path: "guest",
        signUp: async (model: UserModel.IGuest): Promise<UserModel.IGuest> => {
            try {
                // 기존에 가입되어 있는지 확인
                const guests = await searchAll(GUEST_COLLECTION_NAME, [where("휴대폰", "==", model.휴대폰)])
                if (guests?.length > 0) {
                    console.log("이미 신청된 연락처입니다.")
                    return null
                }

                const user = await signUp(model.이메일, model.비밀번호)
                model.uid = user.uid

                // 사용자 프로필 저장
                const storedModel = await upsert(GUEST_COLLECTION_NAME, model)
                return storedModel
            } catch (e) {
                console.log(e);
            }

            return null
        },
    }
}

