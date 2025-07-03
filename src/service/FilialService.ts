import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {FilialModel} from "entities/FilialModel";
import {host} from "shared/config/constants";

export const filialAPI = createApi({
    reducerPath: 'filialAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/filial`,
    }),
    tagTypes: ['filial'],
    endpoints: (build) => ({
        getAllWithStats: build.mutation<FilialModel[], { date: string }>({
            query: ({date}) => ({
                url: `/getAllWithStats?date=${date}`,
                method: 'GET',
            }),
            invalidatesTags: ['filial']
        }),
        getAll: build.mutation<FilialModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['filial']
        }),
        get: build.mutation<FilialModel, { date: string, filialId: number }>({
            query: ({date, filialId}) => ({
                url: `/getWithStats?filialId=${filialId}&date=${date}`,
                method: 'GET',
            }),
            invalidatesTags: ['filial']
        }),
    })
});
