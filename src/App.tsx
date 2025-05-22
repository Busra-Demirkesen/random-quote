import { useContext } from "react";
import QuoteCard from "./components/QuoteCard/QuoteCard";
import IconButton from "./components/IconButton";
import { QuotesContext, QuotesDispatchContext } from "./context/QuotesContext";

const App: React.FC = () => {
  const state = useContext(QuotesContext);
  const dispatch = useContext(QuotesDispatchContext);

  if (!state || !dispatch) return <div>Context not available</div>;

  const { quotes, currentIndex } = state;

  const handleNextQuoteClick = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    dispatch({ type: "ADD_TO_HISTORY", payload: currentIndex });
    dispatch({ type: "SET_CURRENT_INDEX", payload: randomIndex });
  };

  const handlePreviousQuoteClick = () => {
    dispatch({ type: "UNDO_HISTORY" });
  };

  const handleLikeClick = () => {
    dispatch({ type: "LIKE_CURRENT" });
  };

  const handleDislikeClick = () => {
    dispatch({ type: "DISLIKE_CURRENT" });
  };

  return (
    <div className="bg-[#f0e6d2] flex flex-col items-center justify-center h-screen">
      <QuoteCard />

      <div className="flex gap-4 justify-center mt-6">
        <IconButton
          onClick={handleLikeClick}
          iconClass="fa-solid fa-thumbs-up"
        />
        <IconButton
          onClick={handleDislikeClick}
          iconClass="fa-solid fa-thumbs-down"
        />
        <IconButton
          onClick={handlePreviousQuoteClick}
          iconClass="fa-solid fa-left-long"
        />
        <IconButton
          onClick={handleNextQuoteClick}
          iconClass="fa-solid fa-right-long"
        />
      </div>
    </div>
  );
};

export default App;
