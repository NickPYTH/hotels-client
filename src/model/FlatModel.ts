import {RoomModel} from "./RoomModel";
import {HotelModel} from "./HotelModel";

export type FlatModel = {
    id: number;
    name: string;
    floor: number;
    roomsCount: number;
    statusId: number;
    status: string;
    hotelId: number;
    hotelName: string;
    filialId:number;
    bedsCount : number;
    emptyBedsCount: number;
    categoryId: number;
    category: string;
    note: string;
    rooms: RoomModel[];
    flatLockId: number;
    tech: boolean;
    hotel?: HotelModel
}