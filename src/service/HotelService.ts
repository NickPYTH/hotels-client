import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {HotelModel} from "entities/HotelModel";
import {host} from "shared/config/constants";
import {HotelStatsReportModel} from "entities/report/HotelStatsReportModel";

export const hotelAPI = createApi({
    reducerPath: 'hotelAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/hotel`,
    }),
    tagTypes: ['hotel'],
    endpoints: (build) => ({
        getAllByFilialIdWithStats: build.mutation<HotelModel[], { filialId: string, date: string }>({
            query: ({filialId, date}) => ({
                url: `/getAllByFilialIdWithStats?id=${filialId}&date=${date}`,
                method: 'GET',
            }),
            invalidatesTags: ['hotel']
        }),
        getAllByFilialId: build.mutation<HotelModel[], { filialId: string }>({
            query: ({filialId}) => ({
                url: `/getAllByFilialId?id=${filialId}`,
                method: 'GET',
            }),
            invalidatesTags: ['hotel']
        }),
        getAllHotelsByCommendant: build.mutation<HotelModel[], void>({
            query: () => ({
                url: `/getAllByCommendant`,
                method: 'GET',
            }),
            invalidatesTags: ['hotel']
        }),
        getAllHotelsByCommendantWithStats: build.mutation<HotelModel[], void>({
            query: () => ({
                url: `/getAllByCommendantWithStats`,
                method: 'GET',
            }),
            invalidatesTags: ['hotel']
        }),
        getHotelsStats: build.mutation<HotelStatsReportModel[], { idFilial: number, dateStart: string, dateFinish: string }>({
            query: ({idFilial, dateStart, dateFinish}) => ({
                url: `/getHotelsStats?idFilial=${idFilial}&dateStart=${dateStart}&dateFinish=${dateFinish}`,
                method: 'GET',
            }),
            invalidatesTags: ['hotel']
        }),
    })
});
