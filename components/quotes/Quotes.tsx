"use client";

import { useGetQuotesQuery } from "../../lib/features/quotes/quotesAppSlice";
import { useState } from "react";

const options = [5, 10, 20, 30];

export const Quotes = () => {
  const [numberOfQuotes, setNumberOfQuotes] = useState(10);

  // Using RTK Query to fetch quotes
  const { data, isError, isLoading } = useGetQuotesQuery(numberOfQuotes);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 shadow-md rounded-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Select the Quantity of Quotes to Fetch:
      </h3>
      <div className="mb-6">
        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          value={numberOfQuotes}
          onChange={(e) => setNumberOfQuotes(Number(e.target.value))}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          There was an error fetching quotes.
        </div>
      )}

      {isLoading && (
        <div className="p-4 text-gray-700 bg-gray-100 rounded-md">
          Loading...
        </div>
      )}

      {data && (
        <div className="space-y-4">
          {data.quotes.map(({ id, author, quote }) => (
            <blockquote
              key={id}
              className="p-4 bg-white shadow-sm rounded-md border-l-4 border-blue-500"
            >
              <p className="text-gray-800 text-lg italic">&ldquo;{quote}&rdquo;</p>
              <footer className="mt-2 text-right text-sm text-gray-500">
                - {author}
              </footer>
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
};
