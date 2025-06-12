import {
  createContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
  useContext,
} from "react";
import { Quote } from "../types/Quote";

// Helper to generate a unique ID for quotes that might lack one from the API
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export enum QuotesActionType {
  SET_QUOTES = "SET_QUOTES",
  SET_CURRENT_INDEX = "SET_CURRENT_INDEX",
  ADD_TO_HISTORY = "ADD_TO_HISTORY",
  UNDO_HISTORY = "UNDO_HISTORY",
  TOGGLE_LIKE = "TOGGLE_LIKE",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
  SET_LIKED_QUOTES = "SET_LIKED_QUOTES",
}

type QuotesState = {
  quotes: Quote[];
  currentIndex: number;
  history: string[]; // History will store _id of quotes
  likedQuotes: string[]; // Store _id of liked quotes
  isLoading: boolean;
  error: string | null;
};

type QuotesAction =
  | { type: QuotesActionType.SET_QUOTES; payload: Quote[] }
  | { type: QuotesActionType.SET_CURRENT_INDEX; payload: number }
  | { type: QuotesActionType.ADD_TO_HISTORY; payload: string }
  | { type: QuotesActionType.UNDO_HISTORY }
  | { type: QuotesActionType.TOGGLE_LIKE; payload: string } // Payload is the _id of the quote
  | { type: QuotesActionType.SET_LOADING; payload: boolean }
  | { type: QuotesActionType.SET_ERROR; payload: string | null }
  | { type: QuotesActionType.SET_LIKED_QUOTES; payload: string[] };

const quotesReducer = (
  state: QuotesState,
  action: QuotesAction,
): QuotesState => {
  switch (action.type) {
    case QuotesActionType.SET_QUOTES:
      return { ...state, quotes: action.payload, isLoading: false, error: null };

    case QuotesActionType.SET_CURRENT_INDEX:
      return { ...state, currentIndex: action.payload };

    case QuotesActionType.ADD_TO_HISTORY:
      return { ...state, history: [...state.history, action.payload] };

    case QuotesActionType.UNDO_HISTORY:
      const newHistory = [...state.history];
      const lastId = newHistory.pop();
      const lastIndex = state.quotes.findIndex(q => q._id === lastId);
      return {
        ...state,
        currentIndex: lastIndex !== -1 ? lastIndex : state.currentIndex,
        history: newHistory,
      };

    case QuotesActionType.TOGGLE_LIKE:
      const quoteIdToToggle = action.payload;
      const isLiked = state.likedQuotes.includes(quoteIdToToggle);
      const updatedLikedQuotes = isLiked
        ? state.likedQuotes.filter((id) => id !== quoteIdToToggle)
        : [...state.likedQuotes, quoteIdToToggle];

      return { ...state, likedQuotes: updatedLikedQuotes };

    case QuotesActionType.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case QuotesActionType.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case QuotesActionType.SET_LIKED_QUOTES:
      return { ...state, likedQuotes: action.payload };

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
      dispatch({ type: QuotesActionType.SET_LOADING, payload: true });
      try {
        // Load liked quotes from localStorage first
        const storedLikedQuotes = localStorage.getItem("likedQuotes");
        let initialLikedQuotes: string[] = [];
        if (storedLikedQuotes) {
          try {
            initialLikedQuotes = JSON.parse(storedLikedQuotes).filter((id: string | null | undefined) => typeof id === 'string');
          } catch (e) {
            console.error("Failed to parse likedQuotes from localStorage", e);
            localStorage.removeItem("likedQuotes");
          }
        }

        // Dispatch SET_LIKED_QUOTES to update the state with loaded liked quotes
        dispatch({ type: QuotesActionType.SET_LIKED_QUOTES, payload: initialLikedQuotes });

        // Attempt to load quotes from localStorage
        const storedQuotes = localStorage.getItem("quotes");
        let quotesToSet: Quote[] = [];

        if (storedQuotes) {
          try {
            const parsedQuotes: Quote[] = JSON.parse(storedQuotes);
            quotesToSet = parsedQuotes.map(q => {
              const quoteId = (q._id && typeof q._id === 'string') ? q._id : generateUniqueId();
              return {
                ...q,
                _id: quoteId,
                content: (q as any).content || (q as any).quote || '',
                liked: initialLikedQuotes.includes(quoteId)
              };
            });
          } catch (e) {
            console.error("Failed to parse quotes from localStorage", e);
            localStorage.removeItem("quotes");
            quotesToSet = await fetchQuotesFromApi(initialLikedQuotes);
          }
        } else {
          quotesToSet = await fetchQuotesFromApi(initialLikedQuotes);
        }

        dispatch({ type: QuotesActionType.SET_QUOTES, payload: quotesToSet });
      } catch (error: any) {
        dispatch({ type: QuotesActionType.SET_ERROR, payload: error.message });
        console.error("Initialization error:", error);
      } finally {
        dispatch({ type: QuotesActionType.SET_LOADING, payload: false });
      }
    };

    const fetchQuotesFromApi = async (
      currentLikedQuotes: string[],
    ): Promise<Quote[]> => {
      const quotesArray: Quote[] = [];
      try {
        for (let i = 0; i < 10; i++) { // Fetch 10 random quotes
          const response = await fetch("https://api.quotable.io/random");
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: Quote = await response.json(); // API returns a single quote object

          // Ensure _id is a string, generate a unique one if missing or invalid
          const quoteId = (data._id && typeof data._id === 'string') ? data._id : generateUniqueId();

          quotesArray.push({
            ...data,
            _id: quoteId, // Use the validated/generated ID
            // Ensure content is mapped correctly, checking both 'content' and 'quote' properties
            content: (data as any).content || (data as any).quote || '', // API'den gelen 'quote' alanını 'content' alanına eşleştiriyorum
            liked: currentLikedQuotes.includes(quoteId), // Use the validated/generated ID
          });
        }

        localStorage.setItem("quotes", JSON.stringify(quotesArray)); // Cache fetched quotes
        return quotesArray;
      } catch (error: any) {
        dispatch({ type: QuotesActionType.SET_ERROR, payload: error.message });
        console.error("Failed to fetch quotes:", error);
        return [];
      }
    };

    initializeQuotes();
  }, []); // Run only once on mount

  // Effect to persist liked quotes to localStorage whenever they change
  useEffect(() => {
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

export const useQuotesState = () => {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error("useQuotesState must be used within a QuotesProvider");
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
