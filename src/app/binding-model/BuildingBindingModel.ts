import { ArticleCategoryMainType } from "@type/ArticleCategoryMainType";

export namespace BuildingBindingModel {
    export interface ISearchBindingModel {
        page?: number,
        count?: number,
        keyword?: string,
        danJiMyeong?: string,
        juSo?: string,
        siDoCodes?: string[],
        siGunGuCodes?: string[],
        eupMyeonDongCodes?: string[],
        articleCategoryMainTypes?: ArticleCategoryMainType[],
        minOpenCount?: number,
        maxOpenCount?: number,
    }
}
