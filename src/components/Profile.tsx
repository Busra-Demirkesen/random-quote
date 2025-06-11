import React from "react";
import { useQuotesState } from "../context/QuotesContext";
import { Quote } from "../types/Quote";

const Profile: React.FC = () => {
  const { quotes, likedQuotes, isLoading, error } = useQuotesState();

  if (isLoading) {
    return <div className="text-center mt-8">Loading liked quotes...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  const filteredLikedQuotes = quotes.filter((quote: Quote) => likedQuotes.includes(quote._id));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0e6d2] p-4">
      <h2 className="text-3xl font-bold mb-8 text-[#948571]">Your Liked Quotes</h2>
      {filteredLikedQuotes.length === 0 ? (
        <p className="text-lg text-gray-700">You haven't liked any quotes yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full">
          {filteredLikedQuotes.map((quote: Quote) => (
            <div
              key={quote._id}
              className="border border-gray-300 p-5 rounded-lg bg-white shadow-lg text-center"
            >
              <p className="text-lg italic mb-2 text-[#948571]">"{quote.content}"</p>
              <p className="font-bold text-gray-700">- {quote.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile; 