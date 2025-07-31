import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {EventModel} from "entities/EventModel";
import {host} from "shared/config/constants";
import {ChessEvent} from "pages/HotelPage/ui/chess/NewChess";

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
        get: build.mutation<EventModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['event']
        }),
        delete: build.mutation<EventModel, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
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
        getAllByDateRange: build.mutation<ChessEvent[], { dateStart: number, dateFinish: number, hotelId: string }>({
            query: ({dateStart, dateFinish, hotelId}) => ({
                url: `/getAllByDateRange?dateStart=${dateStart}&dateFinish=${dateFinish}&hotelId=${hotelId}`,
                method: 'GET',
            }),
            invalidatesTags: ['event']
        }),
    })
});
