import { createContext, useReducer, useEffect, ReactNode, Dispatch, useContext } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

export enum AuthActionType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
}

// Adding a comment to force TypeScript re-evaluation

// 1. Define AuthState type
interface User {
  id: string;
  email: string | null;
  uid: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// 2. Define AuthAction types
type AuthAction =
  | { type: AuthActionType.LOGIN; payload: User }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.SET_LOADING; payload: boolean }
  | { type: AuthActionType.SET_ERROR; payload: string | null };

// 3. Implement authReducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return { ...state, user: action.payload, isLoading: false, error: null };
    case AuthActionType.LOGOUT:
      return { ...state, user: null, isLoading: false, error: null };
    case AuthActionType.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AuthActionType.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

// 4. Define initial state
const initialState: AuthState = {
  user: null,
  isLoading: true, // Set to true initially to indicate auth state is being loaded
  error: null,
};

// 5. Create AuthContext and AuthDispatchContext
export const AuthContext = createContext<AuthState | undefined>(undefined);
export const AuthDispatchContext = createContext<Dispatch<AuthAction> | undefined>(undefined);

// 6. Define AuthProviderProps type
interface AuthProviderProps {
  children: ReactNode;
}

// 7. Implement AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid, // Use uid as id
          email: firebaseUser.email, // Use email from FirebaseUser
          uid: firebaseUser.uid,
        };
        dispatch({ type: AuthActionType.LOGIN, payload: user });
      } else {
        dispatch({ type: AuthActionType.LOGOUT });
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  // No longer need localStorage persistence for user here, as Firebase manages session
  // useEffect(() => {
  //   if (state.user) {
  //     localStorage.setItem("user", JSON.stringify(state.user));
  //   } else {
  //     localStorage.removeItem("user");
  //   }
  // }, [state.user]);

  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }
  return context;
}; 