import {BedModel} from "./BedModel";
import {EventModel} from "./EventModel";
import {FilialModel} from "./FilialModel";
import {GuestModel} from "./GuestModel";
import {StatusModel} from "./StatusModel";

export type ReservationModel = {
    id: number | null;
    tabnum: number;
    firstname: string;
    lastname: string;
    secondname: string;
    dateStart: string;
    dateFinish: string;
    bed: BedModel;
    event: EventModel;
    fromFilial: FilialModel;
    note: string;
    guest: GuestModel | null;
    status: StatusModel,
    // Для вывода ошибок
    error?: string,
    fio?: string
    // -----
}