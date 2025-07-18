import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import { Metadata } from 'next';
import type { Note } from '@/types/note';
import { getBaseUrl, NOTEHUB_OG_IMAGE } from '@/lib/utils/seo';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const noteId = Number(id);
  const baseUrl = getBaseUrl();

  if (isNaN(noteId)) {
    return {
      title: 'Нотатка не знайдена',
      description: 'Запитувана нотатка не існує або ID недійсний.',
      openGraph: {
        title: 'Нотатка не знайдена',
        description: 'Запитувана нотатка не існує або ID недійсний.',
        url: `${baseUrl}/notes`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: 'NoteHub - Note not found',
          },
        ],
        type: 'website',
        siteName: 'NoteHub',
      },
    };
  }

  let note: Note | undefined;
  try {
    note = await fetchNoteById(noteId);
  } catch (error) {
    console.error(
      `Помилка отримання нотатки для метаданих (ID: ${noteId}):`,
      error
    );
    return {
      title: 'Нотатка не знайдена',
      description: `Нотатка з ID ${noteId} не знайдена.`,
      openGraph: {
        title: 'Нотатка не знайдена',
        description: `Нотатка з ID ${noteId} не знайдена.`,
        url: `${baseUrl}/notes/${noteId}`,
        images: [
          {
            ...NOTEHUB_OG_IMAGE,
            alt: 'NoteHub - Note not found',
          },
        ],
        type: 'website',
        siteName: 'NoteHub',
      },
    };
  }

  const pageUrl = `${baseUrl}/notes/${noteId}`;

  return {
    title: note.title,
    description:
      note.content.slice(0, 100) + (note.content.length > 100 ? '...' : ''),
    openGraph: {
      title: note.title,
      description:
        note.content.slice(0, 100) + (note.content.length > 100 ? '...' : ''),
      url: pageUrl,
      images: [
        {
          ...NOTEHUB_OG_IMAGE,
          alt: `NoteHub - ${note.title}`,
        },
      ],
      type: 'article',
      siteName: 'Notehub',
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  const noteId = Number(id);

  if (isNaN(noteId)) {
    return <div>Неправильний ID нотатки</div>;
  }

  const queryClient = new QueryClient();
  const queryKey = ['note', noteId];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={noteId} />
    </HydrationBoundary>
  );
}
