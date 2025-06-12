import React, { useState, useEffect } from "react";
import { useQuotesState } from "../context/QuotesContext";
import { useAuth } from "../context/AuthContext";
import { Quote } from "../types/Quote";
import { addUserQuote, fetchUserQuotes, updateUserQuote, deleteUserQuote } from "../services/firestoreService";

const Profile: React.FC = () => {
  const { quotes, likedQuotes, isLoading, error } = useQuotesState();
  const { user } = useAuth();

  const [newQuoteContent, setNewQuoteContent] = useState<string>('');
  const [newQuoteAuthor, setNewQuoteAuthor] = useState<string>('');
  const [addQuoteError, setAddQuoteError] = useState<string | null>(null);
  const [addQuoteSuccess, setAddQuoteSuccess] = useState<string | null>(null);
  const [userQuotes, setUserQuotes] = useState<Quote[]>([]);
  const [loadingUserQuotes, setLoadingUserQuotes] = useState<boolean>(true);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserQuotes = async () => {
      if (!user) {
        setUserQuotes([]);
        setLoadingUserQuotes(false);
        return;
      }

      setLoadingUserQuotes(true);
      try {
        const fetchedQuotes = await fetchUserQuotes(user.uid);
        setUserQuotes(fetchedQuotes);
      } catch (err: any) {
        console.error("Error fetching user quotes:", err);
        setAddQuoteError("Failed to load your quotes.");
      } finally {
        setLoadingUserQuotes(false);
      }
    };

    loadUserQuotes();
  }, [user]);

  if (isLoading || loadingUserQuotes) {
    return <div className="text-center mt-8">Loading quotes...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  const handleAddOrUpdateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddQuoteError(null);
    setAddQuoteSuccess(null);

    if (!user) {
      setAddQuoteError('You must be logged in to add/update a quote.');
      return;
    }

    if (!newQuoteContent.trim() || !newQuoteAuthor.trim()) {
      setAddQuoteError('Quote content and author cannot be empty.');
      return;
    }

    try {
      if (editingQuoteId) {
        await updateUserQuote(editingQuoteId, newQuoteContent, newQuoteAuthor);
        setAddQuoteSuccess('Quote updated successfully!');
        setUserQuotes(prevQuotes => prevQuotes.map(q => 
          q._id === editingQuoteId ? { ...q, content: newQuoteContent, author: newQuoteAuthor } : q
        ));
        setEditingQuoteId(null);
      } else {
        const newQuote = await addUserQuote(newQuoteContent, newQuoteAuthor, user.uid);
        setAddQuoteSuccess('Quote added successfully!');
        setUserQuotes(prevQuotes => [newQuote, ...prevQuotes]);
      }
      setNewQuoteContent('');
      setNewQuoteAuthor('');
    } catch (err: any) {
      setAddQuoteError('Failed to add/update quote: ' + err.message);
      console.error('Error adding/updating document: ', err);
    }
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuoteId(quote._id);
    setNewQuoteContent(quote.content);
    setNewQuoteAuthor(quote.author);
    setAddQuoteError(null);
    setAddQuoteSuccess(null);
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!window.confirm("Are you sure you want to delete this quote?")) {
      return;
    }
    try {
      await deleteUserQuote(quoteId);
      setUserQuotes(prevQuotes => prevQuotes.filter(q => q._id !== quoteId));
      setAddQuoteSuccess('Quote deleted successfully!');
    } catch (err: any) {
      setAddQuoteError('Failed to delete quote: ' + err.message);
      console.error('Error deleting document: ', err);
    }
  };

  const filteredLikedQuotes = quotes.filter((quote: Quote) => likedQuotes.includes(quote._id));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0e6d2] p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg mb-12">
        <h3 className="text-2xl font-bold mb-6 text-[#948571] text-center">
          {editingQuoteId ? "Edit Your Quote" : "Add New Quote"}
        </h3>
        {!user && (
          <p className="text-red-500 text-center mb-4">You must be logged in to add/edit a new quote.</p>
        )}
        {addQuoteError && <p className="text-red-500 text-center mb-4">{addQuoteError}</p>}
        {addQuoteSuccess && <p className="text-green-500 text-center mb-4">{addQuoteSuccess}</p>}
        <form onSubmit={handleAddOrUpdateQuote} className="space-y-4">
          <div>
            <label htmlFor="quoteContent" className="block text-gray-700 text-sm font-bold mb-2">
              Quote Content:
            </label>
            <textarea
              id="quoteContent"
              value={newQuoteContent}
              onChange={(e) => setNewQuoteContent(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
              rows={4}
              placeholder="Enter the quote content"
              disabled={!user}
            ></textarea>
          </div>
          <div>
            <label htmlFor="quoteAuthor" className="block text-gray-700 text-sm font-bold mb-2">
              Author:
            </label>
            <input
              type="text"
              id="quoteAuthor"
              value={newQuoteAuthor}
              onChange={(e) => setNewQuoteAuthor(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter the author's name"
              disabled={!user}
            />
          </div>
          <button
            type="submit"
            className="bg-[#948571] hover:bg-[#a69581] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={!user}
          >
            {editingQuoteId ? "Update Quote" : "Add Quote"}
          </button>
          {editingQuoteId && (
            <button
              type="button"
              onClick={() => { setEditingQuoteId(null); setNewQuoteContent(''); setNewQuoteAuthor(''); setAddQuoteError(null); setAddQuoteSuccess(null); }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <h2 className="text-3xl font-bold mb-8 text-[#948571]">Your Added Quotes</h2>
      {loadingUserQuotes ? (
        <p className="text-lg text-gray-700">Loading your quotes...</p>
      ) : userQuotes.length === 0 ? (
        <p className="text-lg text-gray-700">You haven't added any quotes yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full">
          {userQuotes.map((quote: Quote) => (
            <div
              key={quote._id}
              className="border-2 border-[#5a4e40] p-5 rounded-lg bg-[#f9f5f0] shadow-lg text-center flex flex-col justify-between"
            >
              <div>
                <p className="text-lg italic mb-2 text-[#5a4e40]">"{quote.content}"</p>
                <p className="font-bold text-gray-700">- {quote.author}</p>
              </div>
              <div className="flex justify-around mt-4">
                <button
                  onClick={() => handleEditQuote(quote)}
                  className="bg-[#948571] hover:bg-[#a69581] text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuote(quote._id)}
                  className="bg-[#5a4e40] hover:bg-[#4a3e30] text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-8 mt-12 text-[#948571]">Your Liked Quotes</h2>
      {filteredLikedQuotes.length === 0 ? (
        <p className="text-lg text-gray-700">You haven't liked any quotes yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full">
          {filteredLikedQuotes.map((quote: Quote) => (
            <div
              key={quote._id}
              className="border border-gray-300 p-5 rounded-lg bg-white shadow-lg text-center"
            >
              <p className="text-lg italic mb-2 text-[#948571]">{quote.content}</p>
              <p className="font-bold text-gray-700">- {quote.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile; 