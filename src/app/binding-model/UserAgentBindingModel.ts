export namespace UserAgentBindingModel {
    export interface ICreate {
        loginId: string,
        userName: string,
        mobilePhone: string,
        email: string,
        birthday?: string,
        genderType?: string,
        password: string,
    }
}