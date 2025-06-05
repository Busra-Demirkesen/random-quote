import { useContext } from "react";
import { QuotesContext, useQuotesDispatch } from "../../context/QuotesContext";
import type { Quote } from "../../types/Quote";

const QuoteCard: React.FC = () => {
  const context = useContext(QuotesContext);
  const dispatch = useQuotesDispatch();

  if (!context || context.isLoading) {
    return <div>Yükleniyor...</div>;
  }
  if (context.error) {
    return <div>Error: {context.error}</div>;
  }

  const { quotes, currentIndex, likedQuotes } = context;
  const quoteObj: Quote | undefined = quotes[currentIndex];

  if (!quoteObj) return null;

  const isCurrentQuoteLiked = likedQuotes.includes(quoteObj._id);

  const handleLikeToggle = () => {
    dispatch({ type: "TOGGLE_LIKE", payload: quoteObj._id });
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg bg-[#a89882] shadow-lg text-center">
      <p className="text-lg italic mb-2 text-white">"{quoteObj.q}"</p>
      <p className="font-bold mb-2 text-white">- {quoteObj.a}</p>
      <button
        onClick={handleLikeToggle}
        className={`p-2 rounded-full ${isCurrentQuoteLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-600 focus:outline-none`}
      >
        {isCurrentQuoteLiked ? (
          <i className="fa-solid fa-heart fa-2x"></i>
        ) : (
          <i className="fa-regular fa-heart fa-2x"></i>
        )}
      </button>
    </div>
  );
};

export default QuoteCard;
