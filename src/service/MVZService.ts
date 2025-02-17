import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {MVZModel} from "../model/MVZModel";
import {host} from "../config/constants";

export const MVZAPI = createApi({
    reducerPath: 'MVZAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/MVZ`,
    }),
    tagTypes: ['MVZ'],
    endpoints: (build) => ({
        getAll: build.mutation<MVZModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['MVZ']
        }),
        get: build.mutation<MVZModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['MVZ']
        }),
        update: build.mutation<MVZModel, MVZModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['MVZ']
        }),
        create: build.mutation<MVZModel, MVZModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['MVZ']
        }),
    })
});
