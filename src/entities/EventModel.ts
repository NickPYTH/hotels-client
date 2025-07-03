import {EventKindModel} from "entities/EventKindModel";
import {HotelModel} from "entities/HotelModel";

export type EventModel = {
    id: number | null;
    dateStart: number;
    dateFinish: number;
    kind: EventKindModel;
    hotel: HotelModel;

    // Доп. поля для шахматки
    date?: string;
}