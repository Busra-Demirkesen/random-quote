
import "./App.css";
import QuoteCard from "./components/QuoteCard/QuoteCard";
import { createContext, useState, useEffect } from "react";
import { QuotesContext, QuotesDispatchContext } from "./context/QuotesContext";

function App() {
 
  const { quotes, currentIndex, history } = useContext(QuotesContext);
 
  const { setQuotes, setCurrentIndex, setHistory } = useContext(QuotesDispatchContext);

  const handleNextQuoteClick = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setHistory((prev) => [...prev, currentIndex]);
    setCurrentIndex(randomIndex);
  };

  const handlePreviousQuoteClick = () => {
    if (history.length === 0) return;

    const previousIndex = history[history.length - 1];
    setCurrentIndex(previousIndex);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const handleLikeClick = () => {
    const updatedQuotes = quotes.map((quote, index) => {
      if (index === currentIndex) {
        return { ...quote, likeCount: quote.likeCount + 1 };
      }
      return quote;
    });
    setQuotes(updatedQuotes);
  };

  return (
    <div className="App">
      <QuoteCard quoteObj={quotes[currentIndex]} />

      <div className="btn-container">
        <button onClick={handleLikeClick}>
          <i className="fa-solid fa-thumbs-up"></i>
        </button>

        <button onClick={handlePreviousQuoteClick}>
          <i className="fa-solid fa-left-long"></i>
        </button>
        <button onClick={handleNextQuoteClick}>
          <i className="fa-solid fa-right-long"></i>
        </button>
      </div>
    </div>
  );
}

export default App;
