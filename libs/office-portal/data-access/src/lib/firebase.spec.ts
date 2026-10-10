import { beforeEach, describe, expect, it, vi } from 'vitest';

const firebaseApp = vi.hoisted(() => ({
  initializeApp: vi.fn(() => ({ name: 'app' })),
  getAuth: vi.fn(() => ({ kind: 'auth' })),
  connectAuthEmulator: vi.fn(),
  getFirestore: vi.fn(() => ({ kind: 'db' })),
  connectFirestoreEmulator: vi.fn(),
}));

vi.mock('firebase/app', () => ({
  initializeApp: firebaseApp.initializeApp,
}));

vi.mock('firebase/auth', () => ({
  getAuth: firebaseApp.getAuth,
  connectAuthEmulator: firebaseApp.connectAuthEmulator,
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: firebaseApp.getFirestore,
  connectFirestoreEmulator: firebaseApp.connectFirestoreEmulator,
}));

async function loadFirebase() {
  vi.resetModules();
  return import('./firebase');
}

describe('firebase', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    firebaseApp.initializeApp.mockClear();
    firebaseApp.connectAuthEmulator.mockClear();
    firebaseApp.connectFirestoreEmulator.mockClear();
  });

  it('stays unconfigured when the web app keys are missing', async () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', '');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', '');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', '');
    vi.stubEnv('VITE_FIREBASE_APP_ID', '');
    vi.stubEnv('VITE_USE_FIREBASE_EMULATORS', '');

    const firebase = await loadFirebase();

    expect(firebase.isFirebaseConfigured).toBe(false);
    expect(firebase.auth).toBeNull();
    expect(firebase.db).toBeNull();
    expect(firebaseApp.initializeApp).not.toHaveBeenCalled();
  });

  it('connects the Auth and Firestore emulators when requested', async () => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'demo-api-key');
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'localhost');
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'demo-office-portal');
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'demo-app-id');
    vi.stubEnv('VITE_USE_FIREBASE_EMULATORS', 'true');

    const firebase = await loadFirebase();

    expect(firebase.isFirebaseConfigured).toBe(true);
    expect(firebaseApp.connectAuthEmulator).toHaveBeenCalledWith(
      { kind: 'auth' },
      'http://127.0.0.1:9099',
      { disableWarnings: true },
    );
    expect(firebaseApp.connectFirestoreEmulator).toHaveBeenCalledWith(
      { kind: 'db' },
      '127.0.0.1',
      8080,
    );
  });
});
