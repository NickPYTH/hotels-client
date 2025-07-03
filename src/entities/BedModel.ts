import {RoomModel} from "./RoomModel";

export type ChessGuest = {
    id: number;
    post: string | null;
    isReservation: boolean;
    name: string;
    lastname: string;
    secondName: string;
    dateStart: number;
    dateFinish: number;
    male: boolean;
    note: string;
    isCheckouted: boolean;
}

export type ChessDate = {
    date: string;
    guests: ChessGuest[];
}

export type BedModel = {
    id: number;
    name: string;
    room: RoomModel;
    isExtra: boolean;

    // Вычислояемые поля
    dates: ChessDate[];
    // -----
}