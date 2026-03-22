import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, LayoutList, Menu } from 'lucide-react';
import type { Note } from './types';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import NoteList from './components/NoteList';
import EmptyState from './components/EmptyState';
import { getNotes, createNote, updateNote, deleteNote } from './api';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    }
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleSaveNote = async (note: Note) => {
    try {
      if (activeNote) {
        setNotes(notes.map(n => n.id === note.id ? note : n));
        await updateNote(note);
      } else {
        setNotes([note, ...notes]);
        await createNote(note);
      }
      setActiveNoteId(null);
    } catch (error) {
      console.error('Failed to save note', error);
      fetchNotes(); // rollback
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setNotes(notes.filter(n => n.id !== id));
      await deleteNote(id);
    } catch (error) {
      console.error('Failed to delete note', error);
      fetchNotes(); // rollback
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
           className="mobile-overlay" 
           onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        notes={notes}
        activeNoteId={activeNoteId}
        setActiveNoteId={setActiveNoteId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className={`main-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
        <header className="top-header glass-panel">
          <div className="header-left">
            {!isSidebarOpen && (
              <button 
                className="btn-icon" 
                onClick={() => setIsSidebarOpen(true)}
                style={{ marginRight: '0.5rem' }}
                title="Open Sidebar"
              >
                <Menu size={20} />
              </button>
            )}
            <h2>{activeNoteId ? 'Edit Note' : (searchQuery ? `Search: ${searchQuery}` : 'All Notes')}</h2>
          </div>
          <div className="header-right">
            <div className="view-toggles">
              <button 
                className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <LayoutList size={20} />
              </button>
              <button 
                className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => setActiveNoteId('new')}>
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>
        </header>

        <div className="content-area">
          {activeNoteId === 'new' || activeNote ? (
             <NoteEditor 
                note={activeNote} 
                onSave={handleSaveNote}
                onCancel={() => setActiveNoteId(null)}
             />
          ) : notes.length > 0 ? (
            <NoteList 
              notes={notes} 
              viewMode={viewMode}
              searchQuery={searchQuery}
              onSelect={(id: string) => setActiveNoteId(id)}
              onDelete={handleDeleteNote}
            />
          ) : (
            <EmptyState onCreateNew={() => setActiveNoteId('new')} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
