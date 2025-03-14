import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {EventTypeModel} from "../model/EventTypeModel";
import {host} from "../config/constants";

export const eventTypeAPI = createApi({
    reducerPath: 'eventTypeAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/eventType`,
    }),
    tagTypes: ['eventType'],
    endpoints: (build) => ({
        getAll: build.mutation<EventTypeModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['eventType']
        }),
        get: build.mutation<EventTypeModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['eventType']
        }),
        update: build.mutation<EventTypeModel, EventTypeModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['eventType']
        }),
        create: build.mutation<EventTypeModel, EventTypeModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['eventType']
        }),
    })
});
