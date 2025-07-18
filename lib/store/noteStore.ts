import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NoteTag } from '@/types/note';

interface NoteDraft {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteStore {
  draft: NoteDraft;
  setDraft: (note: NoteDraft) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set({ draft: note }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
