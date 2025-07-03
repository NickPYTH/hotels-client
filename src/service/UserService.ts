import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {UserModel} from "entities/UserModel";
import {host} from "shared/config/constants";

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: `${host}/hotels/api/user`,
    }),
    tagTypes: ['user'],
    endpoints: (build) => ({
        create: build.mutation<UserModel, UserModel>({
            query: (body) => ({
                url: `/create`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['user']
        }),
        update: build.mutation<UserModel, UserModel>({
            query: (body) => ({
                url: `/update`,
                method: 'POST',
                body
            }),
            invalidatesTags: ['user']
        }),
        updateRole: build.mutation<UserModel, number>({
            query: (roleId) => ({
                url: `/updateRole?roleId=${roleId}`,
                method: 'POST',
            }),
            invalidatesTags: ['user']
        }),
        getCurrent: build.mutation<UserModel, void>({
            query: () => ({
                url: `/getCurrent`,
                method: 'GET',
            }),
            invalidatesTags: ['user']
        }),
        getAll: build.mutation<UserModel[], void>({
            query: () => ({
                url: `/getAll`,
                method: 'GET',
            }),
            invalidatesTags: ['user']
        }),
    })
});
