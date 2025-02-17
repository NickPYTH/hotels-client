export type RoomLocksModel = {
    id: number;
    roomId: number;
    dateStart: string;
    dateFinish: string;
    statusId: number;
    error?: string;
}