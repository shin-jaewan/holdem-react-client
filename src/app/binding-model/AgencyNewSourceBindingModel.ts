export namespace AgencyNewSourceBindingModel {
    export interface ISearch {
        siDoCode: string,
        siGunGuCode: string,
        gaeSeolDeungRokBeonHo?: string,
        saEopJaSangHo?: string,
        jungGaeEopJaMyeong?: string
    }

    export interface IForceUpdate {
        siDoCode: string,
        siGunGuCode: string,
        saEopJaSangHo: string,
        gaeSeolDeungRokBeonHo: string
    }
}