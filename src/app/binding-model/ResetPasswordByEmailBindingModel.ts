export namespace ResetPasswordByEmailBindingModel {
    export interface ICode {
        userName: String
        loginId: String
        email: String
    }

    export interface IVerify {
        userName: String
        loginId: String
        email: String
        code: String
    }

    export interface IReset {
        userName: String
        loginId: String
        email: String
        newPassword: String
        code: String
    }
}