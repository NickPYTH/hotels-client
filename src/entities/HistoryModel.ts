export type HistoryModel = {
    id: number;
    entityType: string;
    entityId: number;
    request: any | null;
    stateBefore: string;
    stateAfter: string;
}