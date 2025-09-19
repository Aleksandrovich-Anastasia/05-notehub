import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import { useMutation } from '@tanstack/react-query';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  refetch: () => void;
}

const NoteList = ({ notes, refetch }: NoteListProps) => {
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      refetch();
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => mutation.mutate(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
