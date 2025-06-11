import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import QuoteCard from "./components/QuoteCard/QuoteCard";
import IconButton from "./components/IconButton";
import { QuotesProvider, useQuotesState, useQuotesDispatch, QuotesActionType } from "./context/QuotesContext";
import { useAuth, useAuthDispatch, AuthActionType } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Logout from "./components/Auth/Logout";
import Profile from "./components/Profile";

const AppContent: React.FC = () => {
  const state = useQuotesState();
  const dispatch = useQuotesDispatch();

  const { quotes, currentIndex, isLoading, error } = state;

  if (isLoading) {
    return <div className="text-center mt-8">Loading quotes...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  if (quotes.length === 0) {
    return <div className="text-center mt-8">No quotes available.</div>;
  }

  const handleNextQuoteClick = () => {
    console.log('handleNextQuoteClick called. Current quotes:', quotes, 'currentIndex:', currentIndex);
    if (quotes.length > 0) {
      const currentQuote = quotes[currentIndex];
      console.log('Current quote before adding to history:', currentQuote);
      if (currentQuote) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        dispatch({ type: QuotesActionType.ADD_TO_HISTORY, payload: currentQuote._id });
        dispatch({ type: QuotesActionType.SET_CURRENT_INDEX, payload: randomIndex });
        console.log('Dispatched ADD_TO_HISTORY with _id:', currentQuote._id, 'New currentIndex:', randomIndex);
      } else {
        console.error('currentQuote is undefined when trying to add to history. currentIndex:', currentIndex, 'quotes:', quotes);
      }
    } else {
      console.warn('Quotes array is empty, cannot proceed with next quote.');
    }
  };

  const handlePreviousQuoteClick = () => {
    console.log('handlePreviousQuoteClick called. Current history:', state.history);
    dispatch({ type: QuotesActionType.UNDO_HISTORY });
    console.log('Dispatched UNDO_HISTORY.');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <QuoteCard />

      <div className="flex gap-4 justify-center mt-6">
        <IconButton
          onClick={handlePreviousQuoteClick}
          iconClass="fa-solid fa-left-long"
          disabled={quotes.length === 0 || isLoading || state.history.length === 0}
        />
        <IconButton
          onClick={handleNextQuoteClick}
          iconClass="fa-solid fa-right-long"
          disabled={quotes.length === 0 || isLoading}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { user, isLoading, error } = useAuth();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const [displayError, setDisplayError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setDisplayError(error);
      const timer = setTimeout(() => {
        setDisplayError(null);
        dispatch({ type: AuthActionType.SET_ERROR, payload: null });
      }, 5000); // Display error for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (user && (window.location.pathname === "/login" || window.location.pathname === "/register")) {
      navigate("/");
    } else if (!user && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#f0e6d2]">
      <nav className="bg-[#a89882] p-4 text-white flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Random Quotes</Link>
        <div>
          {user ? (
            <>
              <span className="mr-4">Welcome, {user.email}!</span>
              <Link to="/profile" className="mr-4 hover:underline">Profile</Link>
              <Logout />
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </nav>

      {displayError && (
        <div className="bg-red-500 text-white p-3 text-center">
          {displayError}
        </div>
      )}

      {isLoading && <div className="text-center py-4 text-blue-600">Loading...</div>}

      <QuotesProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/"
            element={user ? <AppContent /> : <Login />}
          />
        </Routes>
      </QuotesProvider>
    </div>
  );
};

export default App;
