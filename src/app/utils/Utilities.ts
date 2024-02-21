export const setComma = (v?: number) => {
    return v?.toLocaleString();
}

export class Utilities {
    static timeAgo(timeStamp: string): string {
        const diff = Number(new Date()) - new Date(timeStamp).getTime();
        const minute = 60 * 1000;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30;
        const year = day * 365;
        switch (true) {
            case diff < minute: // 1000
                const seconds = Math.round(diff / 1000);
                return `${seconds} ${seconds > 1 ? '초' : '초'} 전`
            case diff < hour: // 60
                return Math.round(diff / minute) + '분 전';
            case diff < day: // 30
                return Math.round(diff / hour) + '시간 전';
            case diff < month: // 30
                return Math.round(diff / day) + '일 전';
            case diff < year: // 12
                return Math.round(diff / month) + '달 전';
            case diff > year: // 
                return Math.round(diff / year) + '년 전';
            default:
                return "";
        }
    }

    static phone(phone: string): string {
        if (phone.length < 4) {
            return phone
        } else if (phone.length < 8) {
            return `${phone.slice(0, 3)}-${phone.slice(3)}`
        } else {
            return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7, 11)}`
        }
    }

    static trackerFormat(phone: string): string {
        if (phone.length == 12) {
            return `${phone.slice(0, 4)}-${phone.slice(4, 8)}-${phone.slice(8, 12)}`
        } else {
            return phone
        }
    }

    static isMobile(): boolean {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    static numberWithCommas(price: number | null): string {
        if (!price) return "0"

        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    static withDash(phoneNumber?: string) {
        const p = Utilities.withoutDash(phoneNumber);
        if (p) {
            if (p.length > 8) {
                const groups = p.match(/(^02.{0}|^01.{1}|^050.{1}|^05.{1}|^07.{1}|[0-9]{3})([0-9]+)([0-9]{4})/)!;

                return `${groups[1]}-${groups[2]}-${groups[3]}`;
            } else {
                return `${p.substring(0, 4)}-${p.substring(4, 8)}`;
            }
        }
        return ''
    }

    static withoutDash(phoneNumber?: string) {
        if (phoneNumber) {
            return phoneNumber.replace(/[^0-9]/g, "");
        }
    }
}