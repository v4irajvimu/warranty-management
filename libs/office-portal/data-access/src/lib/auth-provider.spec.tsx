import { useState } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
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

const firebaseState = vi.hoisted(() => ({
  configured: true,
}));

vi.mock('./firebase', () => ({
  get auth() {
    return firebaseState.configured ? { kind: 'auth' } : null;
  },
  get db() {
    return firebaseState.configured ? { kind: 'db' } : null;
  },
  get isFirebaseConfigured() {
    return firebaseState.configured;
  },
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

function Harness({ registerName = 'Ada Lovelace' }: { registerName?: string }) {
  const { profile, loading, configured, login, register, logout } = useAuth();
  const [error, setError] = useState('');
  return (
    <div>
      <p>{loading ? 'loading' : 'ready'}</p>
      <p>{configured ? 'configured' : 'unconfigured'}</p>
      <p>
        {profile
          ? `${profile.displayName}|${profile.email}|${profile.role}`
          : 'no-profile'}
      </p>
      <p>{error}</p>
      <button
        type="button"
        onClick={() =>
          login('ada@example.com', 'secret').catch((err: Error) =>
            setError(err.message),
          )
        }
      >
        Login
      </button>
      <button
        type="button"
        onClick={() =>
          register(registerName, 'ada@example.com', 'secret').catch(
            (err: Error) => setError(err.message),
          )
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
    firebaseState.configured = true;
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

    expect(
      await screen.findByText('Ada Lovelace|ada@example.com|admin'),
    ).toBeTruthy();
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
    expect(
      await screen.findByText('Ada Lovelace|ada@example.com|admin'),
    ).toBeTruthy();
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

  it('fills missing profile fields with defaults', async () => {
    authMocks.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({}),
    });

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    authMocks.listener?.(firebaseUser);

    expect(await screen.findByText('||user')).toBeTruthy();
  });

  it('creates a profile named from the email when the user has no name', async () => {
    authMocks.getDoc
      .mockResolvedValueOnce({ exists: () => false, data: () => undefined })
      .mockResolvedValueOnce(existingProfile());

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    authMocks.listener?.({ ...firebaseUser, displayName: null } as User);

    await waitFor(() => {
      expect(authMocks.setDoc).toHaveBeenCalledWith(
        { path: 'users/uid-1' },
        expect.objectContaining({
          displayName: 'ada',
          email: 'ada@example.com',
        }),
      );
    });
  });

  it('creates a profile named User when the user has no name or email', async () => {
    authMocks.getDoc
      .mockResolvedValueOnce({ exists: () => false, data: () => undefined })
      .mockResolvedValueOnce(existingProfile());

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    authMocks.listener?.({
      ...firebaseUser,
      displayName: null,
      email: null,
    } as User);

    await waitFor(() => {
      expect(authMocks.setDoc).toHaveBeenCalledWith(
        { path: 'users/uid-1' },
        expect.objectContaining({ displayName: 'User', email: '' }),
      );
    });
  });

  it('reports an error when the new profile cannot be read back', async () => {
    authMocks.createUser.mockResolvedValue({ user: firebaseUser });
    authMocks.getDoc.mockResolvedValue({
      exists: () => false,
      data: () => undefined,
    });

    render(
      <AuthProvider>
        <Harness registerName="  " />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(
      await screen.findByText(/Could not create your user profile/),
    ).toBeTruthy();
    expect(authMocks.setDoc).toHaveBeenCalledWith(
      { path: 'users/uid-1' },
      expect.objectContaining({ displayName: 'Ada Lovelace' }),
    );
  });

  it('keeps only the latest auth change when profile loads overlap', async () => {
    const errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    let rejectFirst: (error: Error) => void = () => undefined;
    let resolveSecond: (value: unknown) => void = () => undefined;
    let resolveThird: (value: unknown) => void = () => undefined;
    authMocks.getDoc
      .mockReturnValueOnce(
        new Promise((_, reject) => {
          rejectFirst = reject;
        }),
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveSecond = resolve;
        }),
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveThird = resolve;
        }),
      );

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>,
    );

    act(() => {
      authMocks.listener?.(firebaseUser);
      authMocks.listener?.(firebaseUser);
      authMocks.listener?.(firebaseUser);
    });

    await act(async () => {
      rejectFirst(new Error('stale'));
      resolveSecond(existingProfile());
    });
    expect(screen.getByText('loading')).toBeTruthy();
    expect(screen.getByText('no-profile')).toBeTruthy();
    expect(errorSpy).not.toHaveBeenCalled();

    await act(async () => {
      resolveThird(existingProfile());
    });
    expect(screen.getByText('Ada Lovelace|ada@example.com|admin')).toBeTruthy();
    expect(screen.getByText('ready')).toBeTruthy();
    errorSpy.mockRestore();
  });

  describe('when Firebase is not configured', () => {
    beforeEach(() => {
      firebaseState.configured = false;
    });

    it('renders ready without listening for auth changes', () => {
      render(
        <AuthProvider>
          <Harness />
        </AuthProvider>,
      );

      expect(screen.getByText('ready')).toBeTruthy();
      expect(screen.getByText('unconfigured')).toBeTruthy();
      expect(authMocks.listener).toBeNull();
    });

    it('rejects login and register', async () => {
      render(
        <AuthProvider>
          <Harness />
        </AuthProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Login' }));
      expect(
        await screen.findByText('Firebase is not configured.'),
      ).toBeTruthy();

      fireEvent.click(screen.getByRole('button', { name: 'Register' }));
      await waitFor(() => {
        expect(authMocks.createUser).not.toHaveBeenCalled();
      });
      expect(authMocks.signIn).not.toHaveBeenCalled();
    });

    it('ignores logout', async () => {
      render(
        <AuthProvider>
          <Harness />
        </AuthProvider>,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

      await waitFor(() => {
        expect(authMocks.signOut).not.toHaveBeenCalled();
      });
    });
  });
});
