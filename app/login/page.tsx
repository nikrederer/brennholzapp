'use client';

import { FormEvent, useState } from 'react';

interface LoginResponse {
  user: {
    email: string;
    role: string;
  };
  token: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? 'Login fehlgeschlagen');
      }

      const result = (await response.json()) as LoginResponse;
      setMessage(`Erfolgreich angemeldet als ${result.user.email} (${result.user.role})`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unbekannter Fehler beim Login');
    }
  };

  return (
    <section className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-8 shadow">
      <header>
        <h2 className="text-xl font-semibold">Login</h2>
        <p className="text-sm text-slate-600">
          Melden Sie sich mit Ihren Zugangsdaten an, um Bestellungen zu verwalten.
        </p>
      </header>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          E-Mail
          <input
            type="email"
            className="mt-1 w-full rounded border border-slate-300 p-2"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Passwort
          <input
            type="password"
            className="mt-1 w-full rounded border border-slate-300 p-2"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Anmelden
        </button>
      </form>
      {message && <p className="text-sm text-slate-700">{message}</p>}
    </section>
  );
}
