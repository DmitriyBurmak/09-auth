'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import type { NoteTag, CreateNotePayload } from '@/types/note';
import css from './NoteForm.module.css';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import toast from 'react-hot-toast';

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NoteFormProps {}

export default function NoteForm({}: NoteFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [tag, setTag] = useState<NoteTag>(draft.tag);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    tag?: string;
  }>({});

  useEffect(() => {
    setDraft({ title, content, tag });
  }, [title, content, tag, setDraft]);

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: (values: CreateNotePayload) => createNote(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      toast.success('Note successfully created!');
      router.push('/notes/filter/all');
    },
    onError: (error: Error) => {
      console.error('Error creating a note:', error);
      toast.error(`Error: ${error.message}`);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: { title?: string; content?: string; tag?: string } = {};
    if (title.trim().length < 3 || title.trim().length > 50) {
      newErrors.title = 'The title should be from 3 to 50 characters.';
    }
    if (content.length > 500) {
      newErrors.content = 'The content should not exceed 500 characters.';
    }
    if (!tags.includes(tag)) {
      newErrors.tag = 'Invalid tag.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: CreateNotePayload = {
      title: title.trim(),
      content: content.trim(),
      tag: tag,
    };
    createMutation(payload);
  };
  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title.</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isPending}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>
      <div className={css.formGroup}>
        <label htmlFor="content">Зміст</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={isPending}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>
      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={e => setTag(e.target.value as NoteTag)}
          disabled={isPending}
        >
          {tags.map(optionTag => (
            <option key={optionTag} value={optionTag}>
              {optionTag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>
      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create a note
        </button>
      </div>
    </form>
  );
}
