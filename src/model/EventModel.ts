import {EventTypeModel} from "./EventTypeModel";
import {HotelModel} from "./HotelModel";

export type EventModel = {
    id: number;
    name: string;
    description: string;
    type: EventTypeModel;
    dateStart: string;
    dateFinish: string;
    hotel: HotelModel;
    manCount: number;
    womenCount: number;
}