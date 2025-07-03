import {EventTypeModel} from "./EventTypeModel";
import {HotelModel} from "./HotelModel";

export type EventKindModel = {
    id: number | null;
    name: string;
    description: string;
    type: EventTypeModel;
}