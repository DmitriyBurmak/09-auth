'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteByIdClient } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  id: number;
}

const NotePreview: React.FC<NotePreviewProps> = ({ id }) => {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery<Note, Error, Note, ['note', number]>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteByIdClient(id),
    enabled: !isNaN(id),
    refetchOnMount: false,
  });

  if (isNaN(id)) {
    return (
      <Modal onClose={handleClose}>
        <p className={css.message}>Incorrect note ID.</p>
      </Modal>
    );
  }

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p className={css.loadingMessage}>Download a note...</p>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal onClose={handleClose}>
        <p className={css.message}>
          Error loading: {error?.message || 'Unknown error'}
        </p>
      </Modal>
    );
  }

  if (!note) {
    return (
      <Modal onClose={handleClose}>
        <p className={css.message}>Note not found.</p>
      </Modal>
    );
  }

  const dateToFormat = note.updatedAt || note.createdAt;
  let formattedDate = 'Date not specified';
  let datePrefix = '';

  if (dateToFormat) {
    const dateObj = new Date(dateToFormat);
    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      datePrefix = note.updatedAt ? 'Updated' : 'Created';
    }
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <span className={css.tag}>{note.tag}</span>
          <span className={css.date}>
            {datePrefix ? `${datePrefix}: ` : ''}
            {formattedDate}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreview;
