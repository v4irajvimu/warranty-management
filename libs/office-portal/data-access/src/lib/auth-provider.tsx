import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from 'firebase/firestore';
import type {
  Role,
  UserProfile,
} from '@warranty-management/office-portal-util';
import { AuthContext } from './auth-context-value';
import { auth, db, isFirebaseConfigured } from './firebase';

function mapProfile(uid: string, data: Record<string, unknown>): UserProfile {
  const createdAt = data.createdAt as Timestamp | undefined;
  return {
    uid,
    displayName: (data.displayName as string) ?? '',
    email: (data.email as string) ?? '',
    role: (data.role as Role) ?? 'user',
    createdAt: createdAt?.toDate?.(),
  };
}

async function ensureUserProfile(
  firebaseUser: User,
  overrides?: { displayName?: string },
): Promise<UserProfile> {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return mapProfile(firebaseUser.uid, snap.data());
  }

  const displayName =
    overrides?.displayName?.trim() ||
    firebaseUser.displayName?.trim() ||
    firebaseUser.email?.split('@')[0] ||
    'User';
  const email = firebaseUser.email ?? '';

  await setDoc(ref, {
    displayName,
    email,
    role: 'user' satisfies Role,
    createdAt: serverTimestamp(),
  });

  const created = await getDoc(ref);
  if (!created.exists()) {
    throw new Error(
      'Could not create your user profile in Firestore. Check that Firestore is enabled and firestore.rules are published.',
    );
  }

  return mapProfile(firebaseUser.uid, created.data());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    let requestId = 0;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const currentRequest = ++requestId;
      setLoading(true);
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      void ensureUserProfile(firebaseUser)
        .then((userProfile) => {
          if (currentRequest !== requestId) return;
          setProfile(userProfile);
        })
        .catch((error: unknown) => {
          if (currentRequest !== requestId) return;
          console.error('Failed to load user profile', error);
          setProfile(null);
        })
        .finally(() => {
          if (currentRequest !== requestId) return;
          setLoading(false);
        });
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase is not configured.');
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(
    async (displayName: string, email: string, password: string) => {
      if (!auth || !db) throw new Error('Firebase is not configured.');
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(credential.user, { displayName });
      const userProfile = await ensureUserProfile(credential.user, {
        displayName,
      });
      setProfile(userProfile);
      setUser(credential.user);
      setLoading(false);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      configured: isFirebaseConfigured,
      login,
      register,
      logout,
    }),
    [user, profile, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
