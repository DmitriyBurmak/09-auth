import React from 'react';
import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNoteByIdServer } from '@/lib/api/serverApi';
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
  // ЗМІНЕНО: queryKey тепер використовує рядок
  const queryKey = ['note', id];

  try {
    await queryClient.prefetchQuery({
      queryKey: queryKey,
      // ЗМІНЕНО: Передаємо ID як рядок
      queryFn: () => fetchNoteByIdServer(id),
    });
  } catch (error) {
    console.error('Error prefetching note data:', error);
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* ЗМІНЕНО: Передаємо id як рядок */}
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
