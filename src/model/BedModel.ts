import {RoomModel} from "./RoomModel";

export type BedModel = {
    id: number;
    name: string;
    room: RoomModel;
    isExtra: boolean;
}