import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ContractModel} from "../model/ContractModel";
import {OrganizationModel} from "../model/OrganizationModel";
import {host} from "../config/constants";

//${host}
export const organizationAPI = createApi({
    reducerPath: 'organizationAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/organization`,
    }),
    tagTypes: ['organization'],
    endpoints: (build) => ({
        getAll: build.mutation<OrganizationModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['organization']
        }),
        get: build.mutation<OrganizationModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['organization']
        }),
        update: build.mutation<OrganizationModel, OrganizationModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['organization']
        }),
        create: build.mutation<OrganizationModel, OrganizationModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['organization']
        }),
    })
});
