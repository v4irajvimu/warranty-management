const projectId = 'demo-office-portal';
const apiKey = 'demo-api-key';

const users = [
  {
    email: 'user@example.com',
    password: 'password123',
    displayName: 'Regular User',
    role: 'user',
  },
  {
    email: 'admin@example.com',
    password: 'password123',
    displayName: 'Admin User',
    role: 'admin',
  },
];

async function signUp(user) {
  const response = await fetch(
    `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        returnSecureToken: true,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Auth emulator sign-up failed for ${user.email}: ${response.status} ${await response.text()}`,
    );
  }
  return response.json();
}

async function setDisplayName(idToken, displayName) {
  const response = await fetch(
    `http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        idToken,
        displayName,
        returnSecureToken: true,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Auth emulator profile update failed: ${response.status} ${await response.text()}`,
    );
  }
}

async function writeProfile(uid, user) {
  const response = await fetch(
    `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents/users?documentId=${uid}`,
    {
      method: 'POST',
      headers: {
        authorization: 'Bearer owner',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          displayName: { stringValue: user.displayName },
          email: { stringValue: user.email },
          role: { stringValue: user.role },
          createdAt: { timestampValue: '2026-01-01T00:00:00Z' },
        },
      }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Firestore emulator write failed for ${uid}: ${response.status} ${await response.text()}`,
    );
  }
}

for (const user of users) {
  const account = await signUp(user);
  await setDisplayName(account.idToken, user.displayName);
  await writeProfile(account.localId, user);
}

console.log('Seeded emulator users.');
