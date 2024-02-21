import { UserModel } from '@model/UserModel'
import { AccountService } from '@services/AccountService'
import { UserService } from '@services/UserService'
import LocalStorageUtility from '@utils/LocalStorageUtility'
import { useState } from 'react'

export const useAuth = () => {
    const [host, setHost] = useState<UserModel.IHost>()
    const [guest, setGuest] = useState<UserModel.IGuest>()

    const hostAuth = {
        signUp: async (model: UserModel.IHost): Promise<UserModel.IHost> => {
            const host = await AccountService.Host.signUp(model)
            LocalStorageUtility.set(LocalStorageUtility.HOST_KEY, host)
            setHost(host)

            return host
            // location.href = "/"
        },
        singOut: async (): Promise<boolean> => {
            setHost(null)
            LocalStorageUtility.remove(LocalStorageUtility.HOST_KEY, () => {
                // location.href = "/logout"
            })

            return await UserService.Host.singOut()
        },
        login: async (email: string, password: string): Promise<UserModel.IHost> => {
            const host = await AccountService.Host.login(email, password)
            LocalStorageUtility.set(LocalStorageUtility.HOST_KEY, host)
            setHost(host)

            return host
            // location.href = "/"
        },
        logout: async () => {
            setHost(null)
            LocalStorageUtility.remove(LocalStorageUtility.HOST_KEY, () => {
                // location.href = "/logout"
            })
        },
        update: async (): Promise<UserModel.IHost> => {
            const host = await UserService.Host.profile()
            LocalStorageUtility.set(LocalStorageUtility.HOST_KEY, host)
            setHost(host)

            return host
        }
    }

    const guestAuth = {
        signUp: async (model: UserModel.IGuest): Promise<UserModel.IGuest> => {
            const guest = await AccountService.Guest.signUp(model)
            LocalStorageUtility.set(LocalStorageUtility.GUEST_KEY, guest)
            setGuest(guest)

            return guest
            // location.href = "/"
        },
        profile: async () => {
            await UserService.Guest.profile()
        }
    }

    return { host, hostAuth, guest, guestAuth }
}