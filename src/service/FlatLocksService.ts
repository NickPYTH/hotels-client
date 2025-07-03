import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {FlatLocksModel} from "entities/FlatLocksModel";

export const flatLocksAPI = createApi({
    reducerPath: 'flatLocksAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/flatLocks`,
    }),
    tagTypes: ['flatLocks'],
    endpoints: (build) => ({
        getAll: build.mutation<FlatLocksModel[], number>({
            query: (id) => ({
                url: `/getAllByFlat?flatId=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['flatLocks']
        }),
        get: build.mutation<FlatLocksModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['flatLocks']
        }),
        update: build.mutation<FlatLocksModel, FlatLocksModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['flatLocks']
        }),
        create: build.mutation<FlatLocksModel, FlatLocksModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['flatLocks']
        }),
        delete: build.mutation<number, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['flatLocks']
        }),
    })
});
