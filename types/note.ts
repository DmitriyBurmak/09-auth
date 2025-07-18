export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
export type UITag = NoteTag | 'All';

export interface Note {
  id: number;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  total: number;
  page: number;
}
