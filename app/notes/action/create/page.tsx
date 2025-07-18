import React from 'react';
import NoteForm from '@/components/NoteForm/NoteForm';
import { Metadata } from 'next';
import css from './CreateNote.module.css';
import { getBaseUrl, NOTEHUB_OG_IMAGE } from '@/lib/utils/seo';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'NoteHub - Create a note',
  description:
    'Create a new note in NoteHub. Add new notes quickly and easily.',
  openGraph: {
    title: 'NoteHub - Create a note',
    description:
      'Create a new note in NoteHub. Add new notes quickly and easily.',
    url: `${baseUrl}/notes/action/create`,
    images: [
      {
        ...NOTEHUB_OG_IMAGE,
        alt: 'NoteHub - Create Note Page',
      },
    ],
    type: 'website',
    siteName: 'NoteHub',
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create a note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
