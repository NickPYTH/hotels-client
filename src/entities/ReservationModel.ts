import {BedModel} from "./BedModel";
import {EventKindModel} from "./EventKindModel";
import {FilialModel} from "./FilialModel";
import {GuestModel} from "./GuestModel";
import {StatusModel} from "./StatusModel";
import {ContractModel} from "entities/ContractModel";

export type ReservationModel = {
    id: number | null;
    tabnum: number | null;
    firstname: string;
    lastname: string;
    secondName: string;
    male: boolean;
    dateStart: string;
    dateFinish: string;
    bed: BedModel;
    event: EventKindModel;
    fromFilial: FilialModel;
    note: string;
    guest: GuestModel | null;
    status: StatusModel,
    familyMemberOfEmployee: number | null;
    contract: ContractModel | null;

    // Для вывода ошибок
    error?: string,
    fio?: string
    statusGrid?: string
    // -----

    roomId?: number; // Для бронирования доп. места в комнате
}