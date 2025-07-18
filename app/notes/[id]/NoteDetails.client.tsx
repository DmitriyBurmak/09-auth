'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import css from './NoteDetailsClient.module.css';

interface NoteDetailsClientProps {
  id: number;
}

const NoteDetailsClient: React.FC<NoteDetailsClientProps> = ({ id }) => {
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note, Error, Note, ['note', number]>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    enabled: !isNaN(id),
    refetchOnMount: false,
  });

  if (isNaN(id)) {
    return <p className={css.errorMessage}>Incorrect note ID.</p>;
  }

  if (isLoading) {
    return <p className={css.loadingMessage}>Loading, please wait...</p>;
  }

  if (isError) {
    return (
      <p className={css.errorMessage}>
        An error occurred: {error?.message || 'Unknown error'}
      </p>
    );
  }

  if (!note) {
    return <p className={css.errorMessage}>Note not found.</p>;
  }

  const dateToFormat = note.updatedAt || note.createdAt;
  const formattedDate = new Date(dateToFormat).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const datePrefix = note.updatedAt ? 'Updated' : 'Created';

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2 className={css.title}>{note.title}</h2>
          <button
            className={css.editBtn}
            onClick={() => {
              alert(
                `Функціональність редагування нотатки з ID: ${note.id} ще не реалізована.`
              );
            }}
          >
            Edit a note
          </button>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {datePrefix}: {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
