import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";
import { quotes as initialQuotes } from "../quotes";
import { Quote } from "../types/Quote";

type QuotesState = {
  quotes: Quote[];
  currentIndex: number;
  history: number[];
};


type QuotesAction =
  | { type: "SET_QUOTES"; payload: Quote[] }
  | { type: "SET_CURRENT_INDEX"; payload: number }
  | { type: "ADD_TO_HISTORY"; payload: number }
  | { type: "UNDO_HISTORY" }
  | { type: "LIKE_CURRENT" }
  | { type: "DISLIKE_CURRENT" };

const quotesReducer = (state: QuotesState, action: QuotesAction): QuotesState => {
  switch (action.type) {
    case "SET_QUOTES":
      return { ...state, quotes: action.payload };

    case "SET_CURRENT_INDEX":
      return { ...state, currentIndex: action.payload };

    case "ADD_TO_HISTORY":
      return { ...state, history: [...state.history, action.payload] };

    case "UNDO_HISTORY":
      const newHistory = [...state.history];
      const lastIndex = newHistory.pop();
      return {
        ...state,
        currentIndex: lastIndex ?? state.currentIndex,
        history: newHistory,
      };

    case "LIKE_CURRENT":
      const likedQuotes = state.quotes.map((q, i) =>
        i === state.currentIndex
          ? { ...q, likeCount: (q.likeCount ?? 0) + 1 }
          : q
      );
      return { ...state, quotes: likedQuotes };

    case "DISLIKE_CURRENT":
      const dislikedQuotes = state.quotes.map((q, i) =>
        i === state.currentIndex
          ? { ...q, likeCount: Math.max(0, (q.likeCount ?? 0) - 1) }
          : q
      );
      return { ...state, quotes: dislikedQuotes };

    default:
      return state;
  }
};


const initialState: QuotesState = {
  quotes: initialQuotes,
  currentIndex: 0,
  history: [],
};


export const QuotesContext = createContext<QuotesState | undefined>(undefined);
export const QuotesDispatchContext = createContext<Dispatch<QuotesAction> | undefined>(undefined);


type QuotesProviderProps = {
  children: ReactNode;
};

export const QuotesProvider = ({ children }: QuotesProviderProps) => {
  const [state, dispatch] = useReducer(quotesReducer, initialState);

  useEffect(() => {
    localStorage.setItem("quotes", JSON.stringify(state.quotes));
  }, [state.quotes]);

  return (
    <QuotesContext.Provider value={state}>
      <QuotesDispatchContext.Provider value={dispatch}>
        {children}
      </QuotesDispatchContext.Provider>
    </QuotesContext.Provider>
  );
};
