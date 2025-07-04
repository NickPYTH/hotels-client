import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {ReservationModel} from "entities/ReservationModel";

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
        checkSpaces: build.mutation<{ Status: string }, { peopleCount: number, dateStart: number, dateFinish: number, eventId: number, hotelId: number, needReserve: boolean, soloMode: boolean }>({
            query: (props) => ({
                url: `/checkSpaces?peopleCount=${props.peopleCount}&dateStart=${props.dateStart}&dateFinish=${props.dateFinish}&eventId=${props.eventId}&hotelId=${props.hotelId}&needReserve=${props.needReserve}&soloMode=${props.soloMode}`,
                method: 'GET',
            }),
            invalidatesTags: ['reservation']
        }),
    })
});
