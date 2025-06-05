import React, { useContext } from "react";
import { useAuthDispatch } from "../../context/AuthContext";

const Logout: React.FC = () => {
  const dispatch = useAuthDispatch();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    alert("Logged out successfully!"); // User feedback
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#a89882] hover:bg-[#948571] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Logout
    </button>
  );
};

export default Logout; 