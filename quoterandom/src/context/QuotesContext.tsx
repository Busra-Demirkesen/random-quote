import { createContext, useState, useEffect, ReactNode } from "react";
import { quotes as initialQuotes } from "../quotes";

import { Quote } from "../types/quote";



type QuotesContextType = {
  quotes: Quote[];
  currentIndex:number;
  history: number[];
}

type QuotesDispatchContextType = {
  setQuotes: React.Dispatch<React.SetStateAction<Quote[]>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setHistory: React.Dispatch<React.SetStateAction<number[]>>;
}





export const QuotesContext = createContext<QuotesContextType | undefined>(undefined);
export const QuotesDispatchContext = createContext<QuotesDispatchContextType | undefined>(undefined);


type QuotesProviderProps = {
  children: ReactNode;
}

export const QuotesProvider = ({ children }:QuotesProviderProps ) => {
  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem("quotes");
    return saved ? JSON.parse(saved) : initialQuotes;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);

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
