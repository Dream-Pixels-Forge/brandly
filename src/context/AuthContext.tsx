import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loading } from '../components/ui/Loading';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 1000;

    return onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            displayName: authUser.displayName || 'Contributor',
            email: authUser.email || '',
            photoURL: authUser.photoURL || '',
            createdAt: serverTimestamp(),
          });
        }
      }

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        if (!mountedRef.current) return;
        setUser(authUser);
        setLoading(false);
      }, remaining);
    });
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
