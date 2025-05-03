import './QuoteCard.css';

function QuoteCard({ quoteObj }) {
  return (
    <div className="quote-card">
      <p className="quote-text">"{quoteObj.quote}"</p>
      <p className="quote-author">- {quoteObj.author}</p>
      <p className="quote-likes"><i className="fa-solid fa-heart"></i> {quoteObj.likeCount}</p>
    </div>
  );
}

export default QuoteCard;
