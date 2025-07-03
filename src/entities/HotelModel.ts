import {FilialModel} from "./FilialModel";

export type HotelModel = {
    id: number;
    name: string;
    location: string;
    filial: FilialModel;
    mvz: string;

    // Вычисляемые поля
    bedsCount: number | null;
    emptyBedsCount: number | null;
    busyBedsCount: number | null;
    flatsCount: number | null;
}