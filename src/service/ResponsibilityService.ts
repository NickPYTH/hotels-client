import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ResponsibilityModel} from "entities/ResponsibilityModel";
import {host} from "shared/config/constants";

//${'https'}://${'}
export const responsibilityAPI = createApi({
    reducerPath: 'responsibilityAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/responsibility`,
    }),
    tagTypes: ['responsibility'],
    endpoints: (build) => ({
        getAll: build.mutation<ResponsibilityModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['responsibility']
        }),
        getAllByHotelId: build.mutation<ResponsibilityModel[], number>({
            query: (hotelId) => ({
                url: `/getAllByHotelId?hotelId=${hotelId}`,
                method: 'GET',
            }),
            invalidatesTags: ['responsibility']
        }),
        get: build.mutation<ResponsibilityModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['responsibility']
        }),
        update: build.mutation<ResponsibilityModel, ResponsibilityModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['responsibility']
        }),
        create: build.mutation<ResponsibilityModel, ResponsibilityModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['responsibility']
        }),
    })
});
