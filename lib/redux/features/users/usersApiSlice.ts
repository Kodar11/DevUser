// src/lib/redux/features/users/usersApiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const usersApiSlice = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: (response: { users: User[] }) => response.users,
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<void, Partial<User>>({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<void, Partial<User>>({
      query: ({ id, ...rest }) => ({
        url: `/users`,
        method: "PATCH",
        body: { id, ...rest }, // Include `id` in the body along with the updated data
      }),
      invalidatesTags: ["Users"], // Invalidate cache to refetch updated data
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users`,
        method: "DELETE",
        body: { id }, // Include `id` in the body for the DELETE request
      }),
      invalidatesTags: ["Users"], // Invalidate the cache to refetch updated users
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;
