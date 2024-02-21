import { IBase } from "./BaseModel"

export namespace UserModel {
    export interface IGuest extends IBase {
        uid?: string
        이름?: string
        닉네임: string
        휴대폰: string
        이메일: string
        비밀번호: string
        권한: "GUEST"
        참가게임_아이디_목록?: Array<string>
    }

    export interface IHost extends IBase {
        uid?: string
        이름?: string
        닉네임: string
        휴대폰: string
        이메일: string
        비밀번호: string
        권한: "HOST"
        게임_아이디_리스트?: Array<string>
    }
}