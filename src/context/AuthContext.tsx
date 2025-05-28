import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import {auth} from './firebase';
import type { User } from 'firebase/auth';
import { ReactNode, useContext } from 'react';

type AuthContextType = {
  user: User | null;
  logIn: (email: string, password: string) => Promise<any>;
  createAccount: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => useContext(AuthContext);


type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User', user);
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  const createAccount = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
  const logOut = () => signOut(auth);
  
  return <AuthContext.Provider value={{user, logIn, createAccount, logOut}}>
    {children}
  </AuthContext.Provider>;
};