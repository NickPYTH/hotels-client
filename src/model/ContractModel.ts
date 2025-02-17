export type ContractModel = {
    id: number;
    filial: string;
    filialId: number;
    hotel: string;
    hotelId: number;
    organization: string | null;
    organizationId: number | null;
    docnum: string;
    cost: number;
    note: string;
    reason?: string;
    reasonId?: number;
    billing?: string;
    year: number;
    roomNumber: number | null;
}