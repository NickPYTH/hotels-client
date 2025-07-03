import {GuestModel} from "./GuestModel";
import {FlatModel} from "./FlatModel";
import {BedModel} from "./BedModel";
import {StatusModel} from "./StatusModel";

export type RoomModel = {
    id: number;
    name: string;
    bedsCount: number;
    flat: FlatModel,

    // Вычисляемые поля
    status: StatusModel | null;
    roomLockId: number | null;
    guests: GuestModel[] | null;
    beds: BedModel[] | null;
}