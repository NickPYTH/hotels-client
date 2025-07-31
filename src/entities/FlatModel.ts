import {RoomModel} from "./RoomModel";
import {HotelModel} from "./HotelModel";
import {CategoryModel} from "./CategoryModel";
import {StatusModel} from "./StatusModel";

export type FlatModel = {
    id: number;
    name: string;
    floor: number;
    note: string;
    tech: boolean;
    hotel: HotelModel;
    category: CategoryModel | null;

    // Вычисляемые поля
    status: StatusModel | null;
    roomsCount: number | null;
    bedsCount : number | null;
    emptyBedsCount: number | null;
    flatLockId: number | null;
    rooms: RoomModel[] | null;

    // Для шахматки
    flatIndex?: number // Свойство для определения номера секции в цикле
}