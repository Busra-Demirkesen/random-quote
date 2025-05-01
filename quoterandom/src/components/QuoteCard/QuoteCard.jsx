import './QuoteCard.css';
import { useContext } from 'react';
import { QuotesContext } from "../../context/QuotesContext";

function QuoteCard() {

  const {quotes,currentIndex} = useContext(QuotesContext);
  const quoteObj = quotes[currentIndex];

  return (
    <div className="quote-card">
      <p className="quote-text">"{quoteObj.quote}"</p>
      <p className="quote-author">- {quoteObj.author}</p>
      <p className="quote-likes"><i className="fa-solid fa-heart"></i> {quoteObj.likeCount}</p>
    </div>
  );
}

export default QuoteCard;
