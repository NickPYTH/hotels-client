export type HistoryModel = {
    id: number;
    entityType: string;
    entityId: number;
    request: any;
    stateBefore: string;
    stateAfter: string;
}