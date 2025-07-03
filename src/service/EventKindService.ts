import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {EventKindModel} from "entities/EventKindModel";
import {host} from "shared/config/constants";

export const eventKindAPI = createApi({
    reducerPath: 'eventKindAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/eventKind`,
    }),
    tagTypes: ['eventKind'],
    endpoints: (build) => ({
                getAll: build.mutation<EventKindModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['eventKind']
        }),
        get: build.mutation<EventKindModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['eventKind']
        }),
        update: build.mutation<EventKindModel, EventKindModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['eventKind']
        }),
        create: build.mutation<EventKindModel, EventKindModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['eventKind']
        }),
    })
});
