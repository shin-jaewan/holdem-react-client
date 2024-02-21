export default class LocalStorageUtility {
    public static HOST_KEY = "HOST_PROFILE";
    public static GUEST_KEY = "GEUST_PROFILE";

    static set(key: string, value: any, action?: () => void): void {
        if (window.localStorage) {
            let data = value;
            if (typeof (data) === "object") {
                data = JSON.stringify(value);
            }
            window.localStorage.setItem(key, data);

            if (action) {
                action();
            }
        }
    }

    static get(key: string): string {
        if (window.localStorage) {
            return window.localStorage.getItem(key);
        }

        return null;
    }

    static getJSON(key: string): any {
        if (window.localStorage) {
            const data = this.get(key);
            return JSON.parse(data);
        }

        return null;
    }

    static remove(key: string, action?: () => void): void {
        if (window.localStorage) {
            window.localStorage.removeItem(key);

            if (action) {
                action();
            }
        }
    }
}