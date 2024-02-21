import { IBase } from "./BaseModel"
import { UserModel } from "./UserModel"

export namespace GameModel {
    export interface IGame extends IBase {
        대회명: string
        일시: Date
        장소: string
        레지마감?: Date
        GTD?: number
        머니인_순위?: number
        바이인?: number
        게임방식?: string
        듀레이션?: string
        스타팅칩?: string
        문의전화?: string
        대회소개?: string
        대표사진_주소?: string
        공개여부?: boolean
        진행여부?: boolean
        hostId: string
        참가자_목록?: Array<UserModel.IGuest>
    }
}