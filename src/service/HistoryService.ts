import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {HistoryModel} from "entities/HistoryModel";

export const historyAPI = createApi({
    reducerPath: 'historyAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/history`,
    }),
    tagTypes: ['history'],
    endpoints: (build) => ({
        getEntityHistory: build.mutation<HistoryModel[], { entityId: number, entityType: string }>({
            query: ({entityId, entityType}) => ({
                url: `/getEntityHistory?entityId=${entityId}&entityType=${entityType}`,
                method: 'GET',
            }),
            invalidatesTags: ['history']
        }),
    })
});
