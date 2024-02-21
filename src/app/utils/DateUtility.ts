import dayjs from 'dayjs'

export default class DateUtility {
    static toLongDateString(date: string): string {
        return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    }

    static toShortDateString(date: string, format: string = "YYYY-MM-DD"): string {
        return dayjs(date).format(format);
    }

    // static toKoreanShortDateString(dateTimeUtc: string): string {
    //     return moment(moment(dateTimeUtc).toDate()).format("YYYY년 M월 D일");
    // }

    // static toNextShortDateString(dateTimeUtc: string): string {
    //     return moment(moment(dateTimeUtc).toDate()).add(1, "days").format("YYYY-MM-DD");
    // }

    static toDetailDateTimeString(time: number, display: string = "-"): string {
        if (!time) return display

        if (time > 1000000000000) {
            return dayjs(time).format("YYYY-MM-DD HH:mm:ss")
        } else {
            return dayjs.unix(time).format("YYYY-MM-DD HH:mm:ss")
        }
    }

    static stringToDetailDateTimeString(time: string): string {
        if (!time) return '-'

        return dayjs(time).format("YYYY-MM-DD HH:mm:ss")
    }
    // static isBetween(from: string, to: string): boolean {
    //     return moment.utc().isBetween(from, to);
    // }

    // static getTodayShortDateString(format: string = "YYYY-MM-DD"): string {
    //     return moment(moment().toDate()).format(format);
    // }

    // static getBeforeShortDateString(beforeDay: number, format: string = "YYYY-MM-DD"): string {
    //     return moment(moment().subtract(beforeDay).toDate()).format(format);
    // }

    // static getBetweenMonth(fromUtc: string, toUtc: string): number {
    //     const duration: moment.Duration = moment.duration(moment(toUtc).diff(moment(fromUtc)));

    //     return parseInt(duration.asMonths().toString(), 10);
    // }

    // static getBetweenHour(fromUtc: string, toUtc: string): { hour: number, minute: number } {
    //     const minutes = moment(toUtc).diff(moment(fromUtc), "minute");

    //     return { hour: Math.floor(minutes / 60), minute: Math.floor(minutes % 60) };
    // }
}