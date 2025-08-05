import api from './api';
import { User } from '@/types/user';
import { CreateNotePayload, Note, NotesResponse } from '@/types/note';
import { isAxiosError } from 'axios';

interface FetchNotesParams {
  page: number;
  search: string;
  perPage?: number;
  tag?: string;
}

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
};

export const register = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSessionClient = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>('/auth/session');
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Client session check failed: Unauthorized or Forbidden.');
        return null;
      }
      console.error(
        'Client checkSessionClient Axios Error:',
        error.response?.data || error.message
      );
    } else {
      console.error('Client checkSessionClient Unknown Error:', error);
    }
    return null;
  }
};

export const fetchNotesClient = async ({
  page,
  search,
  perPage = 12,
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search.trim() !== '') {
    params.search = search.trim();
  }
  if (tag && tag.toLowerCase() !== 'all') {
    params.tag = tag;
  }
  const { data } = await api.get<NotesResponse>('/notes', { params });
  return data;
};

export const createNoteClient = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
};

export const deleteNoteClient = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteByIdClient = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const fetchUserProfileClient = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateUserProfileClient = async (payload: {
  username: string;
}): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
};
