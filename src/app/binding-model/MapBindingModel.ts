export namespace MapBindingModel {
    export interface ILatLng {
        latitude: number;
        longitude: number
    }

    export interface IMapSearch {
        zoom: number;
        northEast?: ILatLng;
        southWest?: ILatLng;
    }
}
