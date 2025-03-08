import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ExtraModel} from "../model/ExtraModel";
import {host} from "../config/constants";

export const extraAPI = createApi({
    reducerPath: 'extraAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/extra`,
    }),
    tagTypes: ['extra'],
    endpoints: (build) => ({
        getAll: build.mutation<ExtraModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['extra']
        }),
        getAllByGuest: build.mutation<ExtraModel[], number>({
            query: (guestId) => ({
                url: `/getAllByGuest?guestId=${guestId}`,
                method: 'GET',
            }),
            invalidatesTags: ['extra']
        }),
        get: build.mutation<ExtraModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['extra']
        }),
        deleteGuestExtra: build.mutation<ExtraModel, { extraId: number, guestId: number }>({
            query: ({extraId, guestId}) => ({
                url: `/deleteGuestExtra?extraId=${extraId}&guestId=${guestId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['extra']
        }),
        update: build.mutation<ExtraModel, ExtraModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['extra']
        }),
        create: build.mutation<ExtraModel, ExtraModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['extra']
        }),
        createGuestExtra: build.mutation<ExtraModel, { guestId: number, extraId: number }>({
            query: ({extraId, guestId}) => ({
                url: `/createGuestExtra?extraId=${extraId}&guestId=${guestId}`,
                method: 'POST',
            }),
            invalidatesTags: ['extra']
        }),
    })
});
