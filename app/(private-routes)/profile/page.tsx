import React from 'react';
import { Metadata } from 'next';
import css from './ProfilePage.module.css';
import { getBaseUrl, NOTEHUB_OG_IMAGE } from '@/lib/utils/seo';
import { fetchUserProfileServer } from '@/lib/api/serverApi';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  let userEmail = 'User Profile';

  try {
    const user = await fetchUserProfileServer();
    if (user?.email) {
      userEmail = user.email;
    }
  } catch (error) {
    console.error('Failed to fetch user profile for metadata:', error);
  }

  return {
    title: `NoteHub - User profile: ${userEmail}`,
    description: `View your user profile on NoteHub.`,
    openGraph: {
      title: `NoteHub - User profile: ${userEmail}`,
      description: `View your user profile on NoteHub.`,
      url: `${baseUrl}/profile`,
      images: [
        {
          ...NOTEHUB_OG_IMAGE,
          alt: `NoteHub - User Profile Page for ${userEmail}`,
        },
      ],
      type: 'profile',
      siteName: 'NoteHub',
    },
  };
}

export default async function ProfilePage() {
  let user = null;
  try {
    user = await fetchUserProfileServer();
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    redirect('/sign-in');
  }

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <img
            src="https://placehold.co/120x120/E0E0E0/333333?text=Avatar"
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>User name: {user.username || 'Not specified'}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
