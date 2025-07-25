import api from './api';
import { User } from '@/types/user';
import { Note, NotesResponse } from '@/types/note';
import { cookies } from 'next/headers';
import { isAxiosError, AxiosResponse } from 'axios';

const getServerHeaders = async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('accessToken');
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Cookie'] = `${authToken.name}=${authToken.value}`;
  }
  return headers;
};

export const checkSessionServer =
  async (): Promise<AxiosResponse<User> | null> => {
    try {
      const apiRes = await api.get<User>('/auth/session', {
        headers: await getServerHeaders(),
      });
      return apiRes;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn(
            'Server session check failed: Unauthorized or Forbidden.'
          );
          return null;
        }
        console.error(
          'Server checkSessionServer Axios Error:',
          error.response?.data || error.message
        );
      } else {
        console.error('Server checkSessionServer Unknown Error:', error);
      }
      return null;
    }
  };

export const fetchNotesServer = async (
  page: number,
  search: string,
  perPage: number = 12,
  tag?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search.trim() !== '') {
    params.search = search.trim();
  }
  if (tag && tag.toLowerCase() !== 'all') {
    params.tag = tag;
  }
  try {
    const { data } = await api.get<NotesResponse>('/notes', {
      params,
      headers: await getServerHeaders(),
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn(
          'Server fetchNotesServer failed: Unauthorized or Forbidden.'
        );
        throw new Error('Failed to fetch notes: Unauthorized or Forbidden.');
      }
      console.error(
        'Server fetchNotesServer Axios Error:',
        error.response?.data || error.message
      );
    } else {
      console.error('Server fetchNotesServer Unknown Error:', error);
    }
    throw error;
  }
};

export const fetchNoteByIdServer = async (id: number): Promise<Note> => {
  try {
    const { data } = await api.get<Note>(`/notes/${id}`, {
      headers: await getServerHeaders(),
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn(
          'Server fetchNoteByIdServer failed: Unauthorized or Forbidden.'
        );
        throw new Error(
          'Failed to fetch note by ID: Unauthorized or Forbidden.'
        );
      }
      console.error(
        'Server fetchNoteByIdServer Axios Error:',
        error.response?.data || error.message
      );
    } else {
      console.error('Server fetchNoteByIdServer Unknown Error:', error);
    }
    throw error;
  }
};

export const fetchUserProfileServer =
  async (): Promise<AxiosResponse<User> | null> => {
    try {
      const apiRes = await api.get<User>('/users/me', {
        headers: await getServerHeaders(),
      });
      return apiRes;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn(
            'Server session check failed: Unauthorized or Forbidden.'
          );
          return null;
        }
        console.error(
          'Server fetchUserProfileServer Axios Error:',
          error.response?.data || error.message
        );
      } else {
        console.error('Server fetchUserProfileServer Unknown Error:', error);
      }
      return null;
    }
  };
