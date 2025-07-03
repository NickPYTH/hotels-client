import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {RoomModel} from "entities/RoomModel";
import {host} from "shared/config/constants";
import {BedModel} from "entities/BedModel";

export const roomAPI = createApi({
    reducerPath: 'roomAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/room`,
    }),
    tagTypes: ['room'],
    endpoints: (build) => ({
        getAll: build.mutation<RoomModel[], { flatId:number, dateStart:string, dateFinish:string }>({
            query: ({flatId, dateStart, dateFinish}) => ({
                url: `/getAllByFlatId?flatId=${flatId}&dateStart=${dateStart}&dateFinish=${dateFinish}`,
                method: 'GET',
            }),
            invalidatesTags: ['room']
        }),
        updateStatus: build.mutation<RoomModel, { roomId: number, statusId: number }>({
            query: ({roomId, statusId}) => ({
                url: `/updateStatus?roomId=${roomId}&statusId=${statusId}`,
                method: 'GET',
            }),
            invalidatesTags: ['room']
        }),
        getAllBeds: build.mutation<BedModel[], { roomId:number, dateStart:string, dateFinish:string }>({
            query: ({roomId, dateStart, dateFinish}) => ({
                url: `/getAllBeds?roomId=${roomId}&dateStart=${dateStart}&dateFinish=${dateFinish}`,
                method: 'GET',
            }),
            invalidatesTags: ['room']
        }),
        getAvailableBedWithRoomByFlatId: build.mutation<BedModel, { flatId: number, dateStart: string, dateFinish: string }>({
            query: ({flatId, dateStart, dateFinish}) => ({
                url: `/getAvailableBedWithRoomByFlatId?flatId=${flatId}&dateStart=${dateStart}&dateFinish=${dateFinish}`,
                method: 'GET',
            }),
            invalidatesTags: ['room']
        }),
    })
});
