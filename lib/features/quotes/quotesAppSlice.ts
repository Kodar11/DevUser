import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Quote {
  id: number;
  quote: string;
  author: string;
}

interface QuotesApiResponse {
  quotes: Quote[];
}

// Define a service using a base URL and expected endpoints
export const quotesApiSlice = createApi({
  reducerPath: "quotesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/quotes" }),
  tagTypes: ["Quotes"], // Used for caching and invalidation
  endpoints: (builder) => ({
    getQuotes: builder.query<QuotesApiResponse, number>({
      query: (limit) => `?limit=${limit}`,
      providesTags: (result) =>
        result
          ? result.quotes.map(({ id }) => ({ type: "Quotes" as const, id }))
          : [{ type: "Quotes" as const }],
    }),
  }),
});

// Export hooks for components to use
export const { useGetQuotesQuery } = quotesApiSlice;
