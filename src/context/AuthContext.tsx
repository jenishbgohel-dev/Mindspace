import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AdminCheckResult } from '../types';
import {
  auth,
  db,
  googleProvider,
} from '../firebase/config';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  recordLoginEvent,
  checkUserAdminStatus,
} from '../firebase/firestoreService';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isAdmin: boolean;
  adminCheckResult: AdminCheckResult | null;
  isCheckingAdmin: boolean;
  lastLoginWriteStatus: { success: boolean; message?: string } | null;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { name: string; email: string; major: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  recheckAdminStatus: () => Promise<AdminCheckResult>;
  recordManualLoginEvent: () => Promise<{ success: boolean; error?: string }>;
  isAuthModalOpen: boolean;
  openAuthModal: (initialMode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mindspace_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckResult, setAdminCheckResult] = useState<AdminCheckResult | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);
  const [lastLoginWriteStatus, setLastLoginWriteStatus] = useState<{ success: boolean; message?: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const verifyAdmin = useCallback(async (user: FirebaseUser | null) => {
    if (!user) {
      setIsAdmin(false);
      setAdminCheckResult(null);
      return {
        isAdmin: false,
        hasCustomClaim: false,
        hasFirestoreDoc: false,
        checkedAt: new Date().toISOString(),
      };
    }
    setIsCheckingAdmin(true);
    try {
      const result = await checkUserAdminStatus(user);
      setIsAdmin(result.isAdmin);
      setAdminCheckResult(result);
      return result;
    } finally {
      setIsCheckingAdmin(false);
    }
  }, []);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        const userDocRef = doc(db, 'users', fbUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            const loadedUser: User = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Scholar',
              email: data.email || fbUser.email || '',
              major: data.major || 'Academic Studies',
              academicYear: data.academicYear || 'Undergraduate • Fall 2026',
              avatarUrl: data.avatarUrl || fbUser.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(fbUser.email || fbUser.uid)}`,
              streakCount: typeof data.streakCount === 'number' ? data.streakCount : 5,
              initials: (data.name || fbUser.displayName || 'MS').slice(0, 2).toUpperCase(),
            };
            setCurrentUser(loadedUser);
            localStorage.setItem('mindspace_current_user', JSON.stringify(loadedUser));
          } else {
            // New user document creation
            const newUserData: User = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Scholar',
              email: fbUser.email || '',
              major: 'Academic Studies & Research',
              academicYear: 'Undergraduate • Fall 2026',
              avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(fbUser.email || fbUser.uid)}`,
              streakCount: 5,
              initials: (fbUser.displayName || 'MS').slice(0, 2).toUpperCase(),
            };

            await setDoc(userDocRef, {
              uid: fbUser.uid,
              name: newUserData.name,
              email: newUserData.email,
              avatarUrl: newUserData.avatarUrl,
              major: newUserData.major,
              academicYear: newUserData.academicYear,
              streakCount: 5,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });

            setCurrentUser(newUserData);
            localStorage.setItem('mindspace_current_user', JSON.stringify(newUserData));
          }
        } catch (err) {
          console.error('Error fetching/creating user profile in Firestore:', err);
          const fallbackUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Scholar',
            email: fbUser.email || '',
            major: 'Academic Studies',
            academicYear: 'Undergraduate • Fall 2026',
            avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(fbUser.uid)}`,
            streakCount: 5,
            initials: (fbUser.displayName || 'MS').slice(0, 2).toUpperCase(),
          };
          setCurrentUser(fallbackUser);
        }

        // Verify Admin status server-side
        await verifyAdmin(fbUser);
      } else {
        setFirebaseUser(null);
        setCurrentUser(null);
        setIsAdmin(false);
        setAdminCheckResult(null);
        localStorage.removeItem('mindspace_current_user');
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [verifyAdmin]);

  // Requirement 3 & 4: Google Sign-In with Firebase Auth and login history record
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Record login event in loginHistory collection
        try {
          const logRes = await recordLoginEvent(result.user);
          setLastLoginWriteStatus({
            success: logRes.success,
            message: logRes.error,
          });
          if (!logRes.success) {
            console.warn('Note: Login record write returned an error:', logRes.error);
          }
        } catch (logErr: any) {
          console.warn('Non-fatal login history write error:', logErr);
          setLastLoginWriteStatus({
            success: false,
            message: logErr?.message || 'Failed to record login history',
          });
        }

        // Check admin authorization
        await verifyAdmin(result.user);

        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: 'Sign in was cancelled.' };
    } catch (error: any) {
      console.error('Google Sign-in error:', error);
      return { success: false, error: error?.message || 'Failed to authenticate with Google.' };
    }
  };

  const recordManualLoginEvent = async (): Promise<{ success: boolean; error?: string }> => {
    if (!firebaseUser && !currentUser) {
      return { success: false, error: 'No active authenticated user.' };
    }
    const targetUser = firebaseUser || {
      uid: currentUser?.id || 'demo-user',
      email: currentUser?.email || 'demo@scholar.edu',
      displayName: currentUser?.name || 'Academic Scholar',
      providerData: [{ providerId: 'google.com' }],
    };
    const logRes = await recordLoginEvent(targetUser as any);
    setLastLoginWriteStatus({
      success: logRes.success,
      message: logRes.error,
    });
    return logRes;
  };

  // Academic email signin helper
  const login = async (email: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const fallbackName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: User = {
      id: firebaseUser ? firebaseUser.uid : `user-${Date.now()}`,
      name: fallbackName,
      email: normalizedEmail,
      major: 'Academic Research & Studies',
      academicYear: 'Undergraduate • Fall Semester 2026',
      avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      streakCount: 5,
      initials: fallbackName.slice(0, 2).toUpperCase(),
    };

    setCurrentUser(newUser);
    localStorage.setItem('mindspace_current_user', JSON.stringify(newUser));

    if (firebaseUser) {
      await recordLoginEvent(firebaseUser);
      await verifyAdmin(firebaseUser);
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const signup = async (data: { name: string; email: string; major: string; password?: string }): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = data.email.trim().toLowerCase();
    if (!data.name.trim()) return { success: false, error: 'Full name is required.' };
    if (!data.email.trim() || !data.email.includes('@')) return { success: false, error: 'Valid email is required.' };

    const initials = data.name.trim().split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
    const newUser: User = {
      id: firebaseUser ? firebaseUser.uid : `user-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      major: data.major.trim() || 'General Academic Studies',
      academicYear: 'Undergraduate • Fall Semester 2026',
      avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(normalizedEmail)}`,
      streakCount: 5,
      initials: initials || 'MS',
    };

    setCurrentUser(newUser);
    localStorage.setItem('mindspace_current_user', JSON.stringify(newUser));
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error', e);
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    setIsAdmin(false);
    setAdminCheckResult(null);
    localStorage.removeItem('mindspace_current_user');
  };

  const recheckAdminStatus = async (): Promise<AdminCheckResult> => {
    return await verifyAdmin(firebaseUser);
  };

  const openAuthModal = (initialMode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isAuthenticated: currentUser !== null || firebaseUser !== null,
        isAuthLoading,
        isAdmin,
        adminCheckResult,
        isCheckingAdmin,
        lastLoginWriteStatus,
        signInWithGoogle,
        login,
        signup,
        logout,
        recheckAdminStatus,
        recordManualLoginEvent,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
