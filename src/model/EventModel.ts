import {EventTypeModel} from "./EventTypeModel";
import {HotelModel} from "./HotelModel";

export type EventModel = {
    id: number;
    name: string;
    description: string;
    type: EventTypeModel;
}