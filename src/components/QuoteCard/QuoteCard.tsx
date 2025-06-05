import { useContext } from "react";
import { QuotesContext } from "../../context/QuotesContext";
import type { Quote } from "../../types/Quote";

const QuoteCard: React.FC = () => {
  const context = useContext(QuotesContext);

  if (!context) {
    return <div>Yükleniyor...</div>;
  }

  const { quotes, currentIndex } = context;
  const quoteObj: Quote | undefined = quotes[currentIndex];

  if (!quoteObj) return null;

  return (
    <div className="border border-gray-300 p-5 rounded-lg bg-[#a89882] shadow-lg text-center">
      <p className="text-lg italic mb-2 text-white">"{quoteObj.quote}"</p>
      <p className="font-bold mb-2 text-white">- {quoteObj.author}</p>
      <p className="text-base text-white">
        <i className="fa-solid fa-heart"></i> {quoteObj.likeCount}
      </p>
    </div>
  );
};

export default QuoteCard;
