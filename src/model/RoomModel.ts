import {GuestModel} from "./GuestModel";

export type RoomModel = {
    id: number;
    name: string;
    bedsCount: number;
    statusId: number;
    statusName: string;
    filialId: number;
    hotelId: number;
    flatId: number;
    roomLockId: number;
    guests: GuestModel[];
    beds?: any[];
}