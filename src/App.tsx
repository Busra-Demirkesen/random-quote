import React, { useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import QuoteCard from "./components/QuoteCard/QuoteCard";
import IconButton from "./components/IconButton";
import { QuotesContext, QuotesDispatchContext } from "./context/QuotesContext";
import { useAuth, useAuthDispatch } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Logout from "./components/Auth/Logout";

const AppContent: React.FC = () => {
  const state = React.useContext(QuotesContext);
  const dispatch = React.useContext(QuotesDispatchContext);

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
    <div className="flex flex-col items-center justify-center h-screen">
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

const App: React.FC = () => {
  const { user, isLoading, error } = useAuth();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch({ type: "SET_ERROR", payload: null });
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (user && (window.location.pathname === "/login" || window.location.pathname === "/register")) {
      navigate("/");
    } else if (!user && window.location.pathname === "/") {
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

      {isLoading && <div className="text-center py-4 text-blue-600">Loading...</div>}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={user ? <AppContent /> : <Login />}
        />
      </Routes>
    </div>
  );
};

export default App;
