'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserProfileClient,
  updateUserProfileClient,
} from '@/lib/api/clientApi';
import { User, UpdateUserPayload } from '@/types/user';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import css from './EditProfilePage.module.css';
import Loader from '@/app/loading';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { useAuthStore } from '@/lib/store/authStore';

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuthStore();
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User, Error>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfileClient,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const { mutate: updateProfileMutation } = useMutation({
    mutationFn: (payload: UpdateUserPayload) =>
      updateUserProfileClient(payload),
    onMutate: () => {
      setIsSaving(true);
    },
    onSuccess: updatedUser => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setUser(updatedUser);
      toast.success('Profile successfully updated!');
      router.push('/profile');
    },
    onError: (err: any) => {
      console.error('Profile update error:', err);
      toast.error(
        `Profile update error: ${err.response?.data?.message || err.message}`
      );
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('The username cannot be empty.');
      return;
    }
    updateProfileMutation({ username: username.trim() });
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <ErrorMessage message={error?.message || 'Profile loading error.'} />
    );
  }

  if (!user) {
    return <ErrorMessage message="User not found or not authorized." />;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src="https://placehold.co/120x120/E0E0E0/333333"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
            unoptimized={true}
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">User name:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <p className={css.emailText}>Email: {user.email}</p>{' '}
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Save...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
