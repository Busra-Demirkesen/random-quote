import { quotes as initialQuotes } from './quotes';
import './App.css';
import QuoteCard from './components/QuoteCard/QuoteCard';
import { useState, useEffect } from 'react';

function App() {
  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem('quotes');
    return saved ? JSON.parse(saved) : initialQuotes;
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }, [quotes]);

  const handleNextQuoteClick = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentIndex(randomIndex);
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
        <button onClick={handleLikeClick}>❤️</button>
        <button onClick={handleNextQuoteClick}>Next Quote</button>
      </div>
    </div>
  );
}

export default App;
