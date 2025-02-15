// api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import { handleLogout } from '../pages/auth/common/store'

// Define your base query function with the API base URL
const getToken = () => {
    const token = localStorage.getItem('at')
    if (!token || typeof token == undefined || token == 'undefined') {
        return null
    }
    return JSON.parse(token)
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
        const token = getToken()
        if (token) {
            headers.set('at', token)
            headers.set('Content-Type', 'application/json')
        }
        return headers
    },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result.error?.status == 401) {
        const rt = localStorage.getItem('rt')
        if (rt) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/auth/admin/refresh`,
                    {
                        headers: { rt: JSON.parse(rt) },
                    }
                )
                if (response) {
                    // store the new at & rt
                    localStorage.setItem('at', JSON.stringify(response.data.at))
                    localStorage.setItem('rt', JSON.stringify(response.data.rt))
                    // retry the initial query
                    result = await baseQuery(args, api, extraOptions)
                }
            } catch (error) {
                // Log out user if token refresh fails
                api.dispatch(handleLogout())
            }
        } else {
            // Log out user if refresh token is missing
            api.dispatch(handleLogout())
        }
    }
    return result
}

export const api = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Restaurants', 'Invites', 'Pos', 'SinglePos','team','member-detail'],
    endpoints: (builder) => ({
        getAllRestaurants: builder.query({
            query: ({ limit, offset }) => ({
                url:
                    limit || offset
                        ? `admin/restaurants?limit=${limit}&offset=${offset}`
                        : `admin/restaurants`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        getSingleRestaurant: builder.query({
            query: ({ id }) => ({
                url: `admin/restaurant/${id}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        getAllPos: builder.query({
            query: () => ({
                url: `admin/pos`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        getPosById: builder.query({
            query: ({ slug }) => ({
                url: `admin/pos/${slug}`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        postInvite: builder.mutation({
            query: ({ id, data }) => ({
                url: `admin/restaurant/${id}/invite`,
                method: 'POST',
                body: data,
            }),
        }),
        getClientPos: builder.query({
            query: () => ({
                url: `client/pos`,
                method: 'GET',
            }),
            keepUnusedDataFor: 0,
        }),
        postRestaurant: builder.mutation({
            query: ({ data }) => ({
                url: `admin/restaurants`,
                method: 'POST',
                body: data,
            }),
            keepUnusedDataFor: 0,
        }),
        updateRestuarant: builder.mutation({
            query: ({ id, data }) => ({
                url: `admin/restaurant/${id}`,
                body: data,
                method: 'PATCH',
            }),
        }),
        postReportGnerate: builder.mutation({
            query: ({ id, data }) => ({
                url: `admin/restaurant/${id}/report`,
                method: 'POST',
                body: data,
            }),
        }),
        postRestaurantRefresh: builder.mutation({
            query: ({ id, data }) => ({
                url: `admin/restaurant/${id}/refresh`,
                method: 'POST',
                body: data,
            }),
        }),
        getAllTeamMembers: builder.query({
            query: ({ limit, offset }) => ({
                url:
                    limit || offset
                        ? `admin/team?limit=${limit}&offset=${offset}`
                        : `admin/team`,
                method: 'GET',
            }),
            providesTags: ['team'],
        }),
        getTeamMember: builder.query({
            query: ({ id }) => ({
                url: `admin/team/${id}`,
                method: 'GET',
            }),
            providesTags: ['member-detail'],
        }),
        postAdmin: builder.mutation({
            query: (data) => ({
                url: `admin/team`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['team'],
        }),
        deleteTeamMember: builder.mutation({
            query: ({ id }) => ({
                url: `admin/team/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['team'],
        }),
        updateMember: builder.mutation({
            query: ({ id, data }) => ({
                url: `admin/team/${id}`,
                body: data,
                method: 'PATCH',
            }),
            invalidatesTags: ['team', 'member-detail'],
        }),
        deleteRestaurant: builder.mutation({
            query: ({ id }) => ({
                url: `admin/restaurant/${id}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const {
    useGetAllRestaurantsQuery,
    useGetSingleRestaurantQuery,
    useGetAllPosQuery,
    usePostInviteMutation,
    useGetClientPosQuery,
    usePostRestaurantMutation,
    useUpdateRestuarantMutation,
    useGetPosByIdQuery,
    usePostReportGnerateMutation,
    usePostRestaurantRefreshMutation,
    useGetAllTeamMembersQuery,
    useGetTeamMemberQuery,
    usePostAdminMutation,
    useDeleteTeamMemberMutation,
    useUpdateMemberMutation,
    useDeleteRestaurantMutation,
} = api
