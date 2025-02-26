import {FilialModel} from "./FilialModel";

export type HotelModel = {
    id: number;
    name: string;
    location: string;
    filialId: number;
    filialName?: string;
    flatsCount: number;
    bedsCount: number;
    emptyBedsCount: number;
    busyBedsCount: number;
    filial?: FilialModel
}