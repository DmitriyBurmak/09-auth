'use client';

import React, { useState } from 'react';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import css from './SignUpPage.module.css';
import { isAxiosError } from 'axios';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !username || !avatar) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const payload = { email, password, username, avatar };
      const user = await register(payload);
      setUser(user);
      toast.success('Registration successful! Welcome!');
      router.push('/profile');
    } catch (err: unknown) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration error. Please try again.';
      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error('Registration error!');
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Реєстрація</h1>
      <form className={css.form} onSubmit={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            className={css.input}
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="avatar">Link to avatar</label>
          <input
            id="avatar"
            type="url"
            name="avatar"
            className={css.input}
            required
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
