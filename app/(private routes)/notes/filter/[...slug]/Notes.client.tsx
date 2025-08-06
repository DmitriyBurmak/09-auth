'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/authStore';
import { fetchNotesClient } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Link from 'next/link';
import css from './NotesPage.module.css';
import Loader from '@/app/loading';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import type { Note, NotesResponse } from '@/types/note';

interface NotesClientProps {
  initialNotes: Note[];
  initialTotalPages: number;
  currentTag: string;
}

const NotesClient: React.FC<NotesClientProps> = ({
  initialNotes,
  initialTotalPages,
  currentTag,
}) => {
  const queryClient = useQueryClient();
  const { user, isAuthReady } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const notesPerPage = 12;

  useEffect(() => {
    setPage(1);
    setSearch('');
  }, [currentTag]);

  const apiTag = currentTag.toLowerCase() === 'all' ? undefined : currentTag;

  const {
    data: notesData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<NotesResponse>({
    queryKey: ['notes', page, debouncedSearch, apiTag],
    queryFn: () =>
      fetchNotesClient({
        page,
        search: debouncedSearch,
        perPage: notesPerPage,
        tag: apiTag,
      }),
    enabled: isAuthReady && !!user,
    placeholderData: previousData => {
      return (
        queryClient.getQueryData(['notes', page, debouncedSearch, apiTag]) ||
        previousData
      );
    },
  });

  const totalPages = notesData?.totalPages || 1;
  const currentNotes = notesData?.notes || [];

  if (!isAuthReady) {
    return <Loader />;
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value: string) => {
            setSearch(value);
            setPage(1);
          }}
        />
        {totalPages > 1 && (
          <Pagination
            page={page}
            onPageChange={setPage}
            totalPages={totalPages}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create Note +
        </Link>
      </header>
      {(isLoading || isFetching) && <Loader />}
      {isError && (
        <ErrorMessage message={error?.message || 'Unknown error'} />
      )}{' '}
      {!isLoading && !isFetching && !isError && currentNotes.length === 0 ? (
        <div className={css.message}>No notes to display.</div>
      ) : (
        !isLoading &&
        !isFetching &&
        !isError &&
        currentNotes.length > 0 && <NoteList notes={currentNotes} />
      )}
    </div>
  );
};

export default NotesClient;
