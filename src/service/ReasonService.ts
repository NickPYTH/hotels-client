import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {ReasonModel} from "entities/ReasonModel";
import {host} from "shared/config/constants";

//${host}
export const reasonAPI = createApi({
    reducerPath: 'reasonAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/reason`,
    }),
    tagTypes: ['reason'],
    endpoints: (build) => ({
        getAll: build.mutation<ReasonModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['reason']
        }),
        get: build.mutation<ReasonModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['reason']
        }),
        update: build.mutation<ReasonModel, ReasonModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['reason']
        }),
        create: build.mutation<ReasonModel, ReasonModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['reason']
        }),
    })
});
