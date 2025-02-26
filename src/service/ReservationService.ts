import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "../config/constants";
import {ReservationModel} from "../model/ReservationModel";

export const reservationAPI = createApi({
    reducerPath: 'reservationAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/reservation`,
    }),
    tagTypes: ['reservation'],
    endpoints: (build) => ({
        getAll: build.mutation<ReservationModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['reservation']
        }),
        get: build.mutation<ReservationModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['reservation']
        }),
        update: build.mutation<ReservationModel, ReservationModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['reservation']
        }),
        confirm: build.mutation<ReservationModel, number>({
            query: (id) => ({
                url: `/confirm?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['reservation']
        }),
        delete: build.mutation<ReservationModel, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['reservation']
        }),
    })
});
