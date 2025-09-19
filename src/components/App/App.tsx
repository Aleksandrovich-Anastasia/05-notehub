import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesResponse } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { useDebounce } from 'use-debounce';
import Loader from '../Loader/Loader';
import css from './App.module.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

 const { data, isLoading, error, refetch } = useQuery<FetchNotesResponse, Error>({
  queryKey: ['notes', currentPage, debouncedSearch],
  queryFn: () =>
    fetchNotes({ page: currentPage, perPage: 12, search: debouncedSearch }),
  staleTime: 5000,
});

  
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
        

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

     {isLoading && <Loader />}
     {error && <p>Error loading notes: {error.message}</p>}

      {data?.notes && data.notes.length > 0 && (
  <NoteList notes={data.notes} refetch={refetch} />
)}


      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} refetchNotes={refetch} />
        </Modal>
      )}
    </div>
  );
};

export default App;
