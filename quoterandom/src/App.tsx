import { useContext } from "react";
import QuoteCard from "./components/QuoteCard/QuoteCard";
import IconButton from "./components/IconButton";
import { QuotesContext, QuotesDispatchContext } from "./context/QuotesContext";
import { Quote } from "./types/quote";

function App() {

  const quotesContext = useContext(QuotesContext);
  if (!quotesContext) {
    throw new Error("QuotesContext is undefined. Make sure your component is wrapped in QuotesProvider.");
  }
  const { quotes, currentIndex, history } = quotesContext;

  const quotesDispatchContext = useContext(QuotesDispatchContext);
  if (!quotesDispatchContext) {
    throw new Error("QuotesDispatchContext is undefined. Make sure your component is wrapped in QuotesProvider.");
  }
  const { setQuotes, setCurrentIndex, setHistory } = quotesDispatchContext;


  const handleNextQuoteClick = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setHistory((prev: number[]) => [...prev, currentIndex]);
    setCurrentIndex(randomIndex);
  };


  const handlePreviousQuoteClick = () => {
    if (history.length === 0) return;

    const previousIndex = history[history.length - 1];
    setCurrentIndex(previousIndex);
    setHistory((prev: number[]) => prev.slice(0, prev.length - 1));
  };

 
  const handleLikeClick = () => {
    const updatedQuotes = quotes.map((quote: Quote, index: number) => {
      if (index === currentIndex) {
        return { ...quote, likeCount: quote.likeCount + 1 };
      }
      return quote;
    });
    setQuotes(updatedQuotes);
  };

  return (
    <div className="App bg-[#f0e6d2] flex flex-col items-center justify-center h-screen">
      <QuoteCard />

      <div className="flex gap-4 justify-center mt-6">
        <IconButton onClick={handleLikeClick} iconClass="fa-solid fa-thumbs-up" />
        <IconButton onClick={handlePreviousQuoteClick} iconClass="fa-solid fa-left-long" />
        <IconButton onClick={handleNextQuoteClick} iconClass="fa-solid fa-right-long" />
      </div>
    </div>
  );
}

export default App;
