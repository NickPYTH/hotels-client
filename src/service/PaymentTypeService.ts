import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {host} from "shared/config/constants";
import {PaymentTypeModel} from "entities/PaymentTypeModel";

export const paymentTypeAPI = createApi({
    reducerPath: 'paymentTypeAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/paymentType`,
    }),
    tagTypes: ['paymentType'],
    endpoints: (build) => ({
        getAll: build.mutation<PaymentTypeModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['paymentType']
        }),
        get: build.mutation<PaymentTypeModel, number>({
            query: (id) => ({
                url: `/get?id=${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['paymentType']
        }),
        update: build.mutation<PaymentTypeModel, PaymentTypeModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['paymentType']
        }),
        create: build.mutation<PaymentTypeModel, PaymentTypeModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['paymentType']
        }),
    })
});
