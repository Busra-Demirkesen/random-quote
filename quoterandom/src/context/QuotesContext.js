import { createContext, useState, useEffect } from "react";
import { quotes as initialQuotes } from "../quotes.js"; 


export const QuotesContext = createContext(); 
export const QuotesDispatchContext = createContext(); 



export const QuotesProvider = ({ children }) => {
  const [quotes, setQuotes] = useState(() => {
    const saved = localStorage.getItem("quotes");
    return saved ? JSON.parse(saved) : initialQuotes;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }, [quotes]);

  return (
    <QuotesContext.Provider value={{ quotes, currentIndex, history }}>
      <QuotesDispatchContext.Provider value={{ setQuotes, setCurrentIndex, setHistory }}>
        {children}
      </QuotesDispatchContext.Provider>
    </QuotesContext.Provider>
  );
};
