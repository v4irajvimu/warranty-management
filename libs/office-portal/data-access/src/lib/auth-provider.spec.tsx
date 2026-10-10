import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { User } from 'firebase/auth';
import { AuthProvider } from './auth-provider';
import { useAuth } from './use-auth';

const authMocks = vi.hoisted(() => ({
  listener: null as ((user: User | null) => void) | null,
  signIn: vi.fn(),
  signOut: vi.fn(),
  createUser: vi.fn(),
  updateProfile: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (
    _auth: unknown,
    callback: (user: User | null) => void,
  ) => {
    authMocks.listener = callback;
    return () => {
      authMocks.listener = null;
    };
  },
  signInWithEmailAndPassword: (...args: unknown[]) => authMocks.signIn(...args),
  signOut: (...args: unknown[]) => authMocks.signOut(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    authMocks.createUser(...args),
  updateProfile: (...args: unknown[]) => authMocks.updateProfile(...args),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ path: 'users/uid-1' })),
  getDoc: (...args: unknown[]) => authMocks.getDoc(...args),
  setDoc: (...args: unknown[]) => authMocks.setDoc(...args),
  serverTimestamp: () => 'server-time',
}));

vi.mock('./firebase', () => ({
  auth: { kind: 'auth' },
  db: { kind: 'db' },
  isFirebaseConfigured: true,
}));

const firebaseUser = {
  uid: 'uid-1',
  email: 'ada@example.com',
  displayName: 'Ada Lovelace',
} as User;

function existingProfile() {
  return {
    exists: () => true,
    data: () => ({
      displayName: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'admin',
      createdAt: { toDate: () => new Date('2024-01-01T00:00:00Z') },
    }),
  };
}

function Harness() {
  const { profile, loading, login, register, logout } = useAuth();
  return (
    <div>
      <p>{loading ? 'loading' : 'ready'}</p>
      <p>{profile ? `${profile.displayName}:${profile.role}` : 'no-profile'}</p>
      <button
        type="button"
        onClick={() => void login('ada@example.com', 'secret')}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() =>
          void register('Ada Lovelace', 'ada@example.com', 'secret')
        }
      >
        Register
      </button>
      <button type="button" onClick={() => void logout()}>
        Logout
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    authMocks.listener = null;
    authMocks.signIn.mockReset();
    authMocks.signOut.mockReset();
    authMocks.createUser.mockReset();
    authMocks.updateProfile.mockReset();
    authMocks.getDoc.mockReset();
    authMocks.setDoc.mockReset();
    authMocks.signIn.mockResolvedValue(undefined);
    authMocks.signOut.mockResolvedValue(undefined);
    authMocks.updateProfile.mockResolvedValue(undefined);
    authMocks.setDoc.mockResolvedValue(undefined);
  });

  it('loads an existing profile after sign-in', async () => {
    authMocks.getDoc.mockResolvedValue(existingProfile());
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    authMocks.listener?.(firebaseUser);

    expect(await screen.findByText('Ada Lovelace:admin')).toBeTruthy();
    expect(screen.getByText('ready')).toBeTruthy();
  });

  it('clears the profile when signed out', async () => {
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    authMocks.listener?.(null);

    expect(await screen.findByText('no-profile')).toBeTruthy();
    expect(screen.getByText('ready')).toBeTruthy();
  });

  it('signs in with email and password', async () => {
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(authMocks.signIn).toHaveBeenCalledWith(
        { kind: 'auth' },
        'ada@example.com',
        'secret',
      );
    });
  });

  it('registers a user and creates a user-role profile', async () => {
    authMocks.createUser.mockResolvedValue({ user: firebaseUser });
    authMocks.getDoc
      .mockResolvedValueOnce({ exists: () => false, data: () => undefined })
      .mockResolvedValueOnce(existingProfile());

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(authMocks.setDoc).toHaveBeenCalledWith(
        { path: 'users/uid-1' },
        expect.objectContaining({
          displayName: 'Ada Lovelace',
          email: 'ada@example.com',
          role: 'user',
        }),
      );
    });
    expect(await screen.findByText('Ada Lovelace:admin')).toBeTruthy();
  });

  it('signs out', async () => {
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(authMocks.signOut).toHaveBeenCalledWith({ kind: 'auth' });
    });
  });

  it('clears the profile when Firestore cannot load it', async () => {
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    authMocks.getDoc.mockRejectedValue(new Error('missing'));

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    authMocks.listener?.(firebaseUser);

    expect(await screen.findByText('no-profile')).toBeTruthy();
    expect(screen.getByText('ready')).toBeTruthy();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
