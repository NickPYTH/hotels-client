import {ReasonModel} from "./ReasonModel";
import {FilialModel} from "./FilialModel";
import {HotelModel} from "./HotelModel";
import {OrganizationModel} from "./OrganizationModel";

export type ContractModel = {
    id: number | null;
    reason: ReasonModel;
    filial: FilialModel;
    hotel: HotelModel;
    organization: OrganizationModel;
    docnum: string;
    cost: number;
    note: string;
    billing: string;
    year: number;
}