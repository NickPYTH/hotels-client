import {HotelModel} from "./HotelModel";

export type FilialModel = {
    id: number;
    name: string;
    code: number;
    hotels: HotelModel[];
    bedsCount: number;
    emptyBedsCount: number;
    emptyBedsCountWithBusy: number;
    excluded: boolean
}