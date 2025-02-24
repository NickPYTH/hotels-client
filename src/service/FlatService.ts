import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {FlatModel} from "../model/FlatModel";
import {host} from "../config/constants";
import {GuestModel} from "../model/GuestModel";

export const flatAPI = createApi({
    reducerPath: 'flatAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/flat`,
    }),
    tagTypes: ['flat'],
    endpoints: (build) => ({
        getAll: build.mutation<FlatModel[], { hotelId: string, date: string }>({
            query: ({hotelId, date}) => ({
                url: `/getAllByHotelId?id=${hotelId}&date=${date}`,
                method: 'GET',
            }),
            invalidatesTags: ['flat']
        }),
        getAllSimple: build.mutation<FlatModel[], { hotelId: string, dateStart: string, dateFinish: string }>({
            query: ({hotelId, dateStart, dateFinish}) => ({
                url: `/getAll?hotelId=${hotelId}&dateStart=${dateStart}&dateStart=${dateFinish}`,
                method: 'GET',
            }),
            invalidatesTags: ['flat']
        }),
        getAllNotCheckotedBeforeTodayByHotelId: build.mutation<GuestModel[], { hotelId: string, date: string }>({
            query: ({hotelId, date}) => ({
                url: `/getAllNotCheckotedBeforeTodayByHotelId?id=${hotelId}&date=${date}`,
                method: 'GET',
            }),
            invalidatesTags: ['flat']
        }),
        getAllChess: build.mutation<FlatModel[], { hotelId: string, dateStart: string, dateFinish: string }>({
            query: ({hotelId, dateStart, dateFinish}) => ({
                url: `/getAllByHotelIdChess?id=${hotelId}&dateStart=${dateStart}&dateFinish=${dateFinish}`,
                method: 'GET',
            }),
            invalidatesTags: ['flat']
        }),
        get: build.mutation<FlatModel, { flatId: string, date: string }>({
            query: ({flatId, date}) => ({
                url: `/get?id=${flatId}&date=${date}`,
                method: 'GET',
            }),
            invalidatesTags: ['flat']
        }),
        updateStatus: build.mutation<FlatModel, { flatId: number, statusId: number }>({
            query: ({flatId, statusId}) => ({
                url: `/updateStatus?flatId=${flatId}&statusId=${statusId}`,
                method: 'GET',
            }),
            invalidatesTags: ['flat']
        }),
        updateTech: build.mutation<FlatModel, number>({
            query: (id) => ({
                url: `/updateTech?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['flat']
        }),
        updateNote: build.mutation<FlatModel, FlatModel>({
            query: (body) => ({
                url: `/updateNote`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['flat']
        }),
    })
});
