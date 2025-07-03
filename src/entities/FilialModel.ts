import {HotelModel} from "./HotelModel";

export type FilialModel = {
    id: number;
    name: string;
    code: number;
    boss: string;
    excluded: boolean;

    // Вычисляемые поля
    hotels: HotelModel[] | null;
    bedsCount: number | null;
    emptyBedsCount: number | null;
    emptyBedsCountWithBusy: number | null;
}