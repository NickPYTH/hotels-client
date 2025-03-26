import {BedModel} from "./BedModel";
import {ContractModel} from "./ContractModel";
import {OrganizationModel} from "./OrganizationModel";

export type GuestModel = {
    id: number | null;
    tabnum: number | null;
    firstname: string | null;
    lastname: string | null;
    secondName: string | null;
    note: string;
    dateStart: string;
    dateFinish: string;
    regPoMestu: boolean;
    memo: string;
    filialEmployee?: string;
    error?: string;
    male: boolean;
    email?: string;
    organization: OrganizationModel;
    contract: ContractModel;
    bed: BedModel;
    daysCount?: number;
    cost?: number;
    costByNight?: number;
    post?: string;
    checkouted?: boolean;
    nights?: number;
    isReservation?: boolean;
    familyMemberOfEmployee: number | null;
}