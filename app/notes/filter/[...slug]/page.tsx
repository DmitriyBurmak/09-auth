import { fetchNotes } from '@/lib/api';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';
import type { NotesResponse } from '@/types/note';
import { Metadata } from 'next';
import { getBaseUrl, NOTEHUB_OG_IMAGE } from '@/lib/utils/seo';

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}
export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || 'all';

  const pageTitle =
    tag === 'all' ? 'NoteHub - All notes' : `NoteHub - Notes by tag: ${tag}`;
  const pageDescription =
    tag === 'all'
      ? 'View and manage all your notes on NoteHub.'
      : `View and manage your notes filtered by tag "${tag}" on NoteHub.`;

  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/notes/filter/${tag.toLowerCase()}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          ...NOTEHUB_OG_IMAGE,
          alt: `NoteHub - ${tag === 'all' ? 'All notes' : `${tag} notes`} page`,
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] || 'all';
  const apiTag = tag.toLowerCase() === 'all' ? undefined : tag;
  const queryClient = new QueryClient();
  const initialPage = 1;
  const initialSearch = '';
  const initialPerPage = 12;

  const queryKey = [
    'notes',
    initialPage,
    initialSearch,
    initialPerPage,
    apiTag,
  ];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () =>
      fetchNotes(initialPage, initialSearch, initialPerPage, apiTag),
  });

  const prefetchedNotesData = queryClient.getQueryData<NotesResponse>(queryKey);
  const initialNotes = prefetchedNotesData?.notes || [];
  const initialTotalPages = prefetchedNotesData?.totalPages || 1;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialNotes={initialNotes}
        initialTotalPages={initialTotalPages}
        currentTag={tag}
      />
    </HydrationBoundary>
  );
}
