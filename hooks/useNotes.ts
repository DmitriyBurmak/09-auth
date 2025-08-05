import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { fetchNotesClient } from '@/lib/api/clientApi';
import type { NotesResponse } from '@/types/note';

interface UseNotesParams {
  page: number;
  search: string;
  perPage?: number;
  tag?: string;
}

type NotesQueryKey = ['notes', UseNotesParams];

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

  const queryKey: NotesQueryKey = ['notes', params];

  return useQuery<NotesResponse, Error, NotesResponse, NotesQueryKey>({
    queryKey: queryKey,
    queryFn: () => fetchNotesClient(params),
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
        const previousPageParams: UseNotesParams = {
          ...params,
          page: params.page - 1,
        };
        const previousPageKey: NotesQueryKey = ['notes', previousPageParams];
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
