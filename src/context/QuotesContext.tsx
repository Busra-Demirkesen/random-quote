import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
  useContext,
} from "react";
import { Quote } from "../types/Quote";

type QuotesState = {
  quotes: Quote[];
  currentIndex: number;
  history: string[]; // History will store _id of quotes
  likedQuotes: string[]; // Store _id of liked quotes
  isLoading: boolean;
  error: string | null;
};

type QuotesAction =
  | { type: "SET_QUOTES"; payload: Quote[] }
  | { type: "SET_CURRENT_INDEX"; payload: number }
  | { type: "ADD_TO_HISTORY"; payload: string }
  | { type: "UNDO_HISTORY" }
  | { type: "TOGGLE_LIKE"; payload: string } // Payload is the _id of the quote
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const quotesReducer = (
  state: QuotesState,
  action: QuotesAction,
): QuotesState => {
  switch (action.type) {
    case "SET_QUOTES":
      return { ...state, quotes: action.payload, isLoading: false, error: null };

    case "SET_CURRENT_INDEX":
      return { ...state, currentIndex: action.payload };

    case "ADD_TO_HISTORY":
      return { ...state, history: [...state.history, action.payload] };

    case "UNDO_HISTORY":
      const newHistory = [...state.history];
      const lastId = newHistory.pop();
      const lastIndex = state.quotes.findIndex(q => q._id === lastId);
      return {
        ...state,
        currentIndex: lastIndex !== -1 ? lastIndex : state.currentIndex,
        history: newHistory,
      };

    case "TOGGLE_LIKE":
      const quoteIdToToggle = action.payload;
      const isLiked = state.likedQuotes.includes(quoteIdToToggle);
      const updatedLikedQuotes = isLiked
        ? state.likedQuotes.filter((id) => id !== quoteIdToToggle)
        : [...state.likedQuotes, quoteIdToToggle];

      return { ...state, likedQuotes: updatedLikedQuotes };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    default:
      return state;
  }
};

const initialState: QuotesState = {
  quotes: [],
  currentIndex: 0,
  history: [],
  likedQuotes: [],
  isLoading: false,
  error: null,
};

export const QuotesContext = createContext<QuotesState | undefined>(undefined);
export const QuotesDispatchContext = createContext<
  Dispatch<QuotesAction> | undefined
>(undefined);

type QuotesProviderProps = {
  children: ReactNode;
};

export const QuotesProvider = ({ children }: QuotesProviderProps) => {
  const [state, dispatch] = useReducer(quotesReducer, initialState);

  // Effect to load initial quotes and liked status, and fetch if necessary
  useEffect(() => {
    const initializeQuotes = async () => {
      console.log("Initializing quotes and liked status...");
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        // Load liked quotes from localStorage first
        const storedLikedQuotes = localStorage.getItem("likedQuotes");
        let initialLikedQuotes: string[] = [];
        if (storedLikedQuotes) {
          try {
            initialLikedQuotes = JSON.parse(storedLikedQuotes);
            console.log("Loaded liked quotes from localStorage:", initialLikedQuotes);
          } catch (e) {
            console.error("Failed to parse likedQuotes from localStorage", e);
            localStorage.removeItem("likedQuotes");
          }
        }

        // Attempt to load quotes from localStorage
        const storedQuotes = localStorage.getItem("quotes");
        let quotesToSet: Quote[] = [];

        if (storedQuotes) {
          console.log("Attempting to load quotes from localStorage...");
          try {
            const parsedQuotes: Quote[] = JSON.parse(storedQuotes);
            quotesToSet = parsedQuotes.map(q => ({
              ...q,
              liked: initialLikedQuotes.includes(q._id)
            }));
            console.log("Loaded quotes from localStorage:", quotesToSet.length, "quotes.", quotesToSet);
          } catch (e) {
            console.error("Failed to parse quotes from localStorage", e);
            localStorage.removeItem("quotes");
            console.log("Fetching quotes from API due to invalid localStorage data.");
            quotesToSet = await fetchQuotesFromApi(initialLikedQuotes);
          }
        } else {
          console.log("No quotes found in localStorage, fetching from API.");
          quotesToSet = await fetchQuotesFromApi(initialLikedQuotes);
        }

        console.log("Dispatching SET_QUOTES with payload:", quotesToSet.length, "quotes.", quotesToSet);
        dispatch({ type: "SET_QUOTES", payload: quotesToSet });
      } catch (error: any) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        console.error("Initialization error:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        console.log("Initialization complete. Loading state set to false.");
      }
    };

    const fetchQuotesFromApi = async (currentLikedQuotes: string[]): Promise<Quote[]> => {
      console.log("Attempting to fetch quotes from API: /api/quotes");
      try {
        const response = await fetch("/api/quotes");
        console.log("API Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: { q: string, a: string, h: string }[] = await response.json();
        console.log("Data received from API:", data);
        const mappedQuotes: Quote[] = data.map((item) => ({
          _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          q: item.q,
          a: item.a,
          h: item.h,
          liked: currentLikedQuotes.includes(item.q),
        }));
        console.log("Mapped quotes from API:", mappedQuotes.length, "quotes.", mappedQuotes);
        localStorage.setItem("quotes", JSON.stringify(mappedQuotes)); // Cache fetched quotes
        console.log("Quotes cached to localStorage.");
        return mappedQuotes;
      } catch (error: any) {
        dispatch({ type: "SET_ERROR", payload: error.message });
        console.error("Failed to fetch quotes:", error);
        return [];
      }
    };

    initializeQuotes();
  }, []); // Run only once on mount

  // Effect to persist liked quotes to localStorage whenever they change
  useEffect(() => {
    console.log("Liked quotes state changed. Persisting to localStorage:", state.likedQuotes);
    localStorage.setItem("likedQuotes", JSON.stringify(state.likedQuotes));
  }, [state.likedQuotes]);

  return (
    <QuotesContext.Provider value={state}>
      <QuotesDispatchContext.Provider value={dispatch}>
        {children}
      </QuotesDispatchContext.Provider>
    </QuotesContext.Provider>
  );
};

export const useQuotes = () => {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error("useQuotes must be used within a QuotesProvider");
  }
  return context;
};

export const useQuotesDispatch = () => {
  const context = useContext(QuotesDispatchContext);
  if (context === undefined) {
    throw new Error("useQuotesDispatch must be used within a QuotesProvider");
  }
  return context;
};
