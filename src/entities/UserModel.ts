export type UserModel = {
    id: number;
    username: string;
    roleId: number;
    fio: string;
    tabnum: number;
    filial: string;
    filialId?: number;
    roleName: string;
    hotels?: number[];
    customPost: string | null;
}