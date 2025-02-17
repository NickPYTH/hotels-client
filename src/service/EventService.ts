import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {EventModel} from "../model/EventModel";
import {host} from "../config/constants";
import {EventTypeModel} from "../model/EventTypeModel";

export const eventAPI = createApi({
    reducerPath: 'eventAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/event`,
    }),
    tagTypes: ['event'],
    endpoints: (build) => ({
        getAll: build.mutation<EventModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['event']
        }),
        getAllTypes: build.mutation<EventTypeModel[], void>({
            query: () => ({
                url: `/getAllTypes`,
                method: 'GET',
            }),
            invalidatesTags: ['event']
        }),
        get: build.mutation<EventModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['event']
        }),
        update: build.mutation<EventModel, EventModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['event']
        }),
        create: build.mutation<EventModel, EventModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['event']
        }),
    })
});
