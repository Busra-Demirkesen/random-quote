import React, { useContext } from "react";
import { useAuthDispatch } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Logout: React.FC = () => {
  const dispatch = useAuthDispatch();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      alert("Logged out successfully!"); // User feedback
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      console.error("Logout error:", error.message);
    }
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