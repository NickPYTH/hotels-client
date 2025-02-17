import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {RoomModel} from "../model/RoomModel";
import {host} from "../config/constants";
import {BedModel} from "../model/BedModel";

export const roomAPI = createApi({
    reducerPath: 'roomAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/room`,
    }),
    tagTypes: ['room'],
    endpoints: (build) => ({
        getAll: build.mutation<RoomModel[], string>({
            query: (id) => ({
                url: `/getAllByFlatId?id=${id}`,
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
        getAllBeds: build.mutation<BedModel[], number>({
            query: (roomId) => ({
                url: `/getAllBeds?roomId=${roomId}`,
                method: 'GET',
            }),
            invalidatesTags: ['room']
        }),
    })
});
