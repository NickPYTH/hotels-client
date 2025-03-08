import {HotelModel} from "./HotelModel";

export type FilialModel = {
    id: number;
    name: string;
    hotels: HotelModel[];
    bedsCount: number;
    emptyBedsCount: number;
    emptyBedsCountWithBusy: number;
    excluded: boolean
}