import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import type { NotesResponse } from '@/types/note';

interface UseNotesParams {
  page: number;
  search: string;
  perPage?: number;
  tag?: string;
}

type NotesQueryKey = [
  'notes',
  number,
  string,
  number | undefined,
  string | undefined,
];

type UseNotesOptionsWithInitialData = Omit<
  UseQueryOptions<NotesResponse, Error, NotesResponse, NotesQueryKey>,
  'queryKey' | 'queryFn'
> & {
  initialData?: NotesResponse;
};

export const useNotes = (
  params: UseNotesParams,
  options?: UseNotesOptionsWithInitialData
) => {
  const queryClient = useQueryClient();

  const queryKey: NotesQueryKey = [
    'notes',
    params.page,
    params.search,
    params.perPage,
    params.tag,
  ];

  return useQuery<NotesResponse, Error, NotesResponse, NotesQueryKey>({
    queryKey: queryKey,
    queryFn: () =>
      fetchNotes(params.page, params.search, params.perPage, params.tag),
    staleTime: 0,
    retry: 1,
    placeholderData: previousData => {
      const cachedDataForCurrentKey = queryClient.getQueryData(queryKey);
      if (cachedDataForCurrentKey) {
        return cachedDataForCurrentKey as NotesResponse;
      }

      if (previousData) {
        return previousData;
      }

      if (params.page > 1) {
        const previousPageKey: NotesQueryKey = [
          'notes',
          params.page - 1,
          params.search,
          params.perPage,
          params.tag,
        ];
        const cachedDataForPreviousPage =
          queryClient.getQueryData(previousPageKey);
        if (cachedDataForPreviousPage) {
          return cachedDataForPreviousPage as NotesResponse;
        }
      }
      return undefined;
    },
    ...options,
  });
};
