
const ActionTypes = {
    Log: "Log",
    CertificationCompleted: "CertificationCompleted",
    CertificationFailed: "CertificationFailed",
}

export interface LogDataObject {
    log: Object
}

export interface CertificationFailModel {
    message: string
    success: boolean
}

export namespace AppBridge {
    declare interface IAppBridge {
        postMessage(message: string): void
    }

    const bridge = (window as any)["AppBridge"] as IAppBridge

    export function postMessage(type: string, data: Object) {
        console.log(type, data)
        const m = {
            type: type,
            data: JSON.stringify(data)
        }

        bridge?.postMessage(JSON.stringify(m))
    }

    export function log(data: LogDataObject) {
        postMessage(ActionTypes.Log, data)
    }

    // export function certificationCompleted(data: CertificationModel.ICertificationModel) {
    //     postMessage(ActionTypes.CertificationCompleted, data)
    // }

    export function certificationFailed(data: CertificationFailModel) {
        postMessage(ActionTypes.CertificationFailed, data)
    }
}