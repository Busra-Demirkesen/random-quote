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


  const [history,setHistory] = useState([]);

  const handleNextQuoteClick = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setHistory(prev => [...prev, currentIndex]);
    setCurrentIndex(randomIndex);
  };

  const handlePreviousQuoteClick = () => {
    if (history.length === 0) return;

    const previousIndex = history[history.length - 1];
  setCurrentIndex(previousIndex);
  setHistory(prev => prev.slice(0, prev.length - 1));
  }

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

        <button onClick={handlePreviousQuoteClick}><i class="fa-solid fa-left-long"></i></button>
        <button onClick={handleNextQuoteClick}><i class="fa-solid fa-right-long"></i></button>
       
      </div>
    </div>
  );
}

export default App;
