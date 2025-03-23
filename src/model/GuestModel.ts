import {BedModel} from "./BedModel";

export type GuestModel = {
    id: number;
    tabnum: number | null;
    firstname: string;
    lastname: string;
    secondName: string;
    note: string;
    dateStart: string;
    dateFinish: string;
    organizationId: number;
    organizationName: string;
    regPoMestu: boolean;
    memo: string;
    billing: string;
    reason: string;
    filialEmployee?: string;
    error?: string;
    male: boolean;
    email?: string;
    bed: BedModel;
    daysCount?: number;
    cost?: number;
    costByNight?: number;
    post?: string;
    checkouted?: boolean;
    contractId?: number;
    contractNumber?: string;
    nights?: number;
    isReservation?: boolean;
    familyMemberOfEmployee: number | null;
}