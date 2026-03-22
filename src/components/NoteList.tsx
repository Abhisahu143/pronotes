import React from 'react';
import type { Note } from '../types';
import NoteCard from './NoteCard';

interface NoteListProps {
  notes: Note[];
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, viewMode, searchQuery, onSelect, onDelete }) => {
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const titleMatch = note.title?.toLowerCase().includes(query) ?? false;
    const contentMatch = note.content?.toLowerCase().includes(query) ?? false;
    const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(query)) ?? false;
    
    return titleMatch || contentMatch || tagMatch;
  });

  return (
    <div className={viewMode === 'grid' ? 'notes-grid' : 'notes-list'}>
      {filteredNotes.map((note, index) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          index={index}
          onClick={onSelect}
          onDelete={onDelete}
        />
      ))}
      
      {filteredNotes.length === 0 && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <p>No notes found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default NoteList;
