import React from 'react';
import { BookOpen, Search, Menu, Hash } from 'lucide-react';
import type { Note } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  notes: Note[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  notes,
  activeNoteId,
  setActiveNoteId,
  searchQuery,
  setSearchQuery
}) => {
  // Extract unique tags for the sidebar
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));

  return (
    <aside className={`sidebar ${!isOpen ? 'closed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <BookOpen className="logo-icon" size={24} />
          <span>Zenith</span>
        </div>
        <button className="btn-icon" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={20} />
        </button>
      </div>

      <div className="sidebar-search">
        <div className="search-wrapper">
          <Search className="search-icon" size={16} />
          <input 
            type="text" 
            className="modern-input search-input" 
            placeholder="Search notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0.5rem 1rem', textTransform: 'uppercase', fontWeight: 600 }}>
          Navigation
        </div>
        <button 
          className={`nav-item ${!activeNoteId && activeNoteId !== 'new' && !searchQuery ? 'active' : ''}`}
          onClick={() => {
            setActiveNoteId(null);
            setSearchQuery('');
          }}
        >
          <BookOpen size={18} />
          <span>All Notes</span>
          <span className="badge" style={{ marginLeft: 'auto' }}>{notes.length}</span>
        </button>

        {allTags.length > 0 && (
          <>
            <div className="nav-section-title" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', padding: '1.5rem 1rem 0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Tags
            </div>
            {allTags.map(tag => (
              <button 
                key={tag} 
                className={`nav-item ${searchQuery === tag ? 'active' : ''}`}
                onClick={() => {
                  setSearchQuery(tag);
                  setActiveNoteId(null);
                }}
              >
                <Hash size={18} />
                <span>{tag}</span>
              </button>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
