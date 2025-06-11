import { useQuotesState, useQuotesDispatch, QuotesActionType } from "../../context/QuotesContext";
import type { Quote } from "../../types/Quote";

const QuoteCard: React.FC = () => {
  const context = useQuotesState();
  const dispatch = useQuotesDispatch();

  if (context.isLoading) {
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
    dispatch({ type: QuotesActionType.TOGGLE_LIKE, payload: quoteObj._id });
  };

  return (
    <div className="border border-gray-300 p-5 rounded-lg bg-[#a89882] shadow-lg text-center">
      <p className="text-lg italic mb-2 text-white">"{quoteObj.content}"</p>
      <p className="font-bold mb-2 text-white">- {quoteObj.author}</p>
      <button
        onClick={handleLikeToggle}
        className={`p-2 rounded-full ${isCurrentQuoteLiked ? 'text-[#7a6b57]' : 'text-white'} hover:text-[#5a4e40] focus:outline-none`}
      >
        {isCurrentQuoteLiked ? (
          <i className="fa-solid fa-thumbs-down fa-2x"></i>
        ) : (
          <i className="fa-solid fa-thumbs-up fa-2x"></i>
        )}
      </button>
    </div>
  );
};

export default QuoteCard;
