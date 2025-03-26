import {FilialModel} from "./FilialModel";

export type HotelModel = {
    id: number;
    name: string;
    location: string;
    filial: FilialModel;

    // Вычисляемые поля
    bedsCount: number | null;
    emptyBedsCount: number | null;
    busyBedsCount: number | null;
    flatsCount: number | null;
}