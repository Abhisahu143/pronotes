import React from 'react';
import { Trash2, CheckCircle, FileText, Code } from 'lucide-react';
import type { Note } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  index: number;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index, onClick, onDelete }) => {
  const getIcon = () => {
    switch (note.type) {
      case 'checklist': return <CheckCircle size={16} />;
      case 'code': return <Code size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <div 
      className="glass-panel note-card" 
      onClick={() => onClick(note.id)}
      style={{
        ...(note.color ? { borderTop: `4px solid ${note.color}` } : {}),
        '--delay': index
      } as React.CSSProperties}
    >
      <div className="note-card-header">
        <h3 className="note-title" style={{ color: note.color || 'var(--text-main)' }}>{note.title || 'Untitled Note'}</h3>
        <button className="btn-icon" onClick={handleDelete} style={{ color: 'var(--danger-color)', padding: '0.25rem' }}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="note-preview" style={{ color: note.color || 'var(--text-muted)' }}>
        {note.type === 'checklist' && note.checklist ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {note.checklist.slice(0, 3).map(item => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', opacity: item.completed ? 0.5 : 1 }}>
                <div style={{ width: '12px', height: '12px', border: '1px solid currentColor', borderRadius: '3px', background: item.completed ? 'currentColor' : 'transparent' }} />
                <span style={{ textDecoration: item.completed ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.text}
                </span>
              </li>
            ))}
            {note.checklist.length > 3 && (
              <li style={{ fontStyle: 'italic', fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.7 }}>
                + {note.checklist.length - 3} more items
              </li>
            )}
          </ul>
        ) : (
          note.content || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>Empty note</span>
        )}
      </div>

      <div className="note-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {getIcon()}
          <span>{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
        </div>
        
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="badge">
                {tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="badge">+{note.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
