import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {GuestModel} from "entities/GuestModel";
import {host} from "shared/config/constants";

export const guestAPI = createApi({
    reducerPath: 'guestAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/guest`,
    }),
    tagTypes: ['guest'],
    endpoints: (build) => ({
        getAll: build.mutation<GuestModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['guest']
        }),
        getAllByOrganizationId: build.mutation<GuestModel[], number>({
            query: (orgId) => ({
                url: `/getAllByOrganizationId?id=${orgId}`,
                method: 'GET',
            }),
            invalidatesTags: ['guest']
        }),
        create: build.mutation<GuestModel, GuestModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['guest']
        }),
        update: build.mutation<GuestModel, GuestModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['guest']
        }),
        delete: build.mutation<GuestModel, number>({
            query: (id) => ({
                url: `/delete?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['guest']
        }),
        checkout: build.mutation<GuestModel, number>({
            query: (id) => ({
                url: `/checkout?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['guest']
        }),
        getFioByTabnum: build.mutation<GuestModel, number>({
            query: (tabnum) => ({
                url: `/getFioByTabnum?tabnum=${tabnum}`,
                method: 'GET',
            }),
            invalidatesTags: ['guest']
        }),
        getTabnumByFio: build.mutation<GuestModel, {lastname: string, firstname: string, secondName: string}>({
            query: ({lastname, firstname, secondName}) => ({
                url: `/getTabnumByFio?lastname=${lastname}&firstname=${firstname}&secondName=${secondName}`,
                method: 'GET',
            }),
            invalidatesTags: ['guest']
        }),
        getGuestsLastnames: build.mutation<string[], void>({
            query: () => ({
                url: `/getGuestsLastnames`,
                method: 'GET',
            }),
            invalidatesTags: ['guest']
        }),
    })
});
