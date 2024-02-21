
export namespace ConfigModel {
    export interface SelectOption<T> {
        text: string,
        value: T
    }

    export interface TokenPagination<T> {
        items: Array<T>,
        nextToken: string,
    }
}