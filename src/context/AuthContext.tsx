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


type AuthAction =
  | { type: AuthActionType.LOGIN; payload: User }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.SET_LOADING; payload: boolean }
  | { type: AuthActionType.SET_ERROR; payload: string | null };


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


const initialState: AuthState = {
  user: null,
  isLoading: true, 
  error: null,
};


export const AuthContext = createContext<AuthState | undefined>(undefined);
export const AuthDispatchContext = createContext<Dispatch<AuthAction> | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        };
        dispatch({ type: AuthActionType.LOGIN, payload: user });
      } else {
        dispatch({ type: AuthActionType.LOGOUT });
      }
    });

 
    return () => unsubscribe();
  }, []);



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