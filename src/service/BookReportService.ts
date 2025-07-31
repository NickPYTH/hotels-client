import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {BookReportModel} from "entities/BookReportModel";
//${host}
export const bookReportAPI = createApi({
    reducerPath: 'bookReportAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/bookReport`,
    }),
    tagTypes: ['bookReport'],
    endpoints: (build) => ({
        getAll: build.mutation<BookReportModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['bookReport']
        })
    })
});
