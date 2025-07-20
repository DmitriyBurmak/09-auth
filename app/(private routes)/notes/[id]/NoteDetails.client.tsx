'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteByIdClient } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NoteDetailsClient.module.css';

interface NoteDetailsClientProps {
  id: string;
}

const NoteDetailsClient: React.FC<NoteDetailsClientProps> = ({ id }) => {
  const noteIdAsNumber = Number(id);
  const isValidId = !isNaN(noteIdAsNumber);
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note, Error, Note, ['note', string]>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdClient(id),
    enabled: isValidId,
    refetchOnMount: false,
  });

  if (!isValidId) {
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
                `The functionality of editing a note with ID: ${note.id} is not yet implemented.`
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
