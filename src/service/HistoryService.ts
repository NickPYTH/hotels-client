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
        getGuestHistory: build.mutation<HistoryModel[], number>({
            query: (guestId) => ({
                url: `/getGuestHistory?guestId=${guestId}`,
                method: 'GET',
            }),
            invalidatesTags: ['history']
        }),
    })
});
