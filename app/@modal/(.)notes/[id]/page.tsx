import React from 'react';
import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';

import NotePreview from './NotePreview.client';

interface InterceptedNotePageProps {
  params: Promise<{ id: string }>;
}

export default async function InterceptedNotePage({
  params,
}: InterceptedNotePageProps) {
  const { id } = await params;
  const noteId = Number(id);

  if (isNaN(noteId)) {
    notFound();
  }

  const queryClient = new QueryClient();
  const queryKey = ['note', noteId];

  try {
    await queryClient.prefetchQuery({
      queryKey: queryKey,
      queryFn: () => fetchNoteById(noteId),
    });
  } catch (error) {
    console.error('Error prefetching note data:', error);

    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={noteId} />
    </HydrationBoundary>
  );
}
