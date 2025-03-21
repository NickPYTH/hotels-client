import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import { host } from "../config/constants";
import {ContractModel} from "../model/ContractModel";
import {OrganizationModel} from "../model/OrganizationModel";

export const contractAPI = createApi({
    reducerPath: 'contractAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/contract`,
    }),
    tagTypes: ['contract'],
    endpoints: (build) => ({
        getAll: build.mutation<ContractModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['contract']
        }),
        get: build.mutation<ContractModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['contract']
        }),
        update: build.mutation<ContractModel, ContractModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['contract']
        }),
        create: build.mutation<ContractModel, ContractModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['contract']
        }),
        getAllByFilialAndHotelAndReason: build.mutation<ContractModel[], { filial: number, hotel: number, reason: number, org: string, billing: string }>({
            query: ({filial, hotel, reason, org, billing}) => ({
                url: `/getAllByFilialAndHotel?filialId=${filial}&hotelId=${hotel}&reasonId=${reason}&org=${org}&billing=${billing}`,
                method: 'GET',
            }),
            invalidatesTags: ['contract']
        }),
    })
});
