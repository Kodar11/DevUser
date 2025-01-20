import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: number;
  name: string;
  email: string;
}

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // Base API URL
  tagTypes: ["Users"], // Tag for caching and invalidation
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"], // Ensures fresh data when invalidated
    }),
    createUser: builder.mutation<void, Partial<User>>({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"], // Refresh users data after creation
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApiSlice;
