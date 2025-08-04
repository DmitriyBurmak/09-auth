import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import { fetchNoteByIdServer } from '@/lib/api/serverApi';
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
      title: 'Note not found',
      description: 'The requested note does not exist or the ID is invalid.',
      openGraph: {
        title: 'Note not found',
        description: 'The requested note does not exist or the ID is invalid.',
        url: `${baseUrl}/notes`,
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

  let note: Note | undefined;
  try {
    note = await fetchNoteByIdServer(id);
  } catch (error) {
    console.error(`Error getting a note for metadata (ID: ${noteId}):`, error);
    return {
      title: 'Note not found',
      description: `Note with ID ${noteId} not found.`,
      openGraph: {
        title: 'Note not found',
        description: `Note with ID ${noteId} not found.`,
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
    return <div>Incorrect note ID</div>;
  }

  const queryClient = new QueryClient();
  const queryKey = ['note', noteId];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}
