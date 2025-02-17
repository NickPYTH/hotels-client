import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {RoomLocksModel} from "../model/RoomLocksModel";
import {host} from "../config/constants";

export const roomLocksAPI = createApi({
    reducerPath: 'roomLocksAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/roomLocks`,
    }),
    tagTypes: ['reason'],
    endpoints: (build) => ({
        getAll: build.mutation<RoomLocksModel[], number>({
            query: (id) => ({
                url: `/getAllByRoom?roomId=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['reason']
        }),
        get: build.mutation<RoomLocksModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['reason']
        }),
        update: build.mutation<RoomLocksModel, RoomLocksModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['reason']
        }),
        create: build.mutation<RoomLocksModel, RoomLocksModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['reason']
        }),
        delete: build.mutation<number, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['reason']
        }),
    })
});
