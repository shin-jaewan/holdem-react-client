// this declare file is module (trick)
export { };

declare global {
    interface Window { ReactNativeWebView: { postMessage: (data: any) => void } }

    const profile: string
    const isProduction: boolean
}