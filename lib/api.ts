import axios from 'axios';
import { Note, CreateNotePayload } from '@/types/note';
import { NotesResponse } from '@/types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const getAuthHeaders = () => {
  if (!TOKEN) {
    throw new Error(
      'Authentication token is not set. Please check your .env.local file.'
    );
  }
  return {
    Authorization: `Bearer ${TOKEN}`,
  };
};

export const fetchNotes = async (
  page: number,
  search: string,
  perPage: number = 12,
  tag?: string
): Promise<NotesResponse> => {
  if (page < 1) {
    throw new Error('Page must be 1 or greater');
  }

  const params: Record<string, string | number> = { page, perPage };
  if (search.trim() !== '') {
    params.search = search.trim();
  }

  if (tag && tag.toLowerCase() !== 'all') {
    params.tag = tag;
  }

  const { data } = await axios.get<NotesResponse>('/notes', {
    params,
    headers: getAuthHeaders(),
  });

  return data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const { data } = await axios.post<Note>('/notes', payload, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const fetchNoteById = async (id: number): Promise<Note> => {
  const { data } = await axios.get<Note>(`/notes/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};
