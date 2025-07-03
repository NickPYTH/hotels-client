import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {LogModel} from "entities/LogModel";
import {host} from "shared/config/constants";
//${host}
export const logAPI = createApi({
    reducerPath: 'logAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/log`,
    }),
    tagTypes: ['log'],
    endpoints: (build) => ({
        getAll: build.mutation<LogModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['log']
        })
    })
});
