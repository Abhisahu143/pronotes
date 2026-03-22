import React, { useState } from 'react';
import { ArrowLeft, Save, Type, CheckSquare, Code as CodeIcon, Tag as TagIcon, Plus, X } from 'lucide-react';
import type { Note, NoteType, ChecklistItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

const COLORS = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#0ea5e9', // Sky
];

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [type, setType] = useState<NoteType>(note?.type || 'text');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(note?.checklist || []);
  const [color, setColor] = useState(note?.color || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [newTag, setNewTag] = useState('');

  // Handle checklist item toggling
  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateChecklistItem = (id: string, text: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    
    const noteData: Note = {
      id: note?.id || uuidv4(),
      title,
      content,
      type,
      checklist: type === 'checklist' ? checklist : undefined,
      color,
      tags,
      pinned: note?.pinned || false,
      createdAt: note?.createdAt || now,
      updatedAt: now,
    };

    onSave(noteData);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="editor-container animate-fade-in">
      <div className="editor-header">
        <button className="btn btn-ghost" onClick={onCancel}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn-icon ${type === 'text' ? 'active' : ''}`}
            onClick={() => setType('text')}
            title="Text Note"
            style={type === 'text' ? { color: 'var(--primary-color)', background: 'var(--surface-color)' } : {}}
          >
            <Type size={20} />
          </button>
          <button 
            className={`btn-icon ${type === 'checklist' ? 'active' : ''}`}
            onClick={() => {
              setType('checklist');
              if (checklist.length === 0) {
                setChecklist([{ id: uuidv4(), text: '', completed: false }]);
              }
            }}
            title="Checklist Note"
            style={type === 'checklist' ? { color: 'var(--primary-color)', background: 'var(--surface-color)' } : {}}
          >
            <CheckSquare size={20} />
          </button>
          <button 
            className={`btn-icon ${type === 'code' ? 'active' : ''}`}
            onClick={() => setType('code')}
            title="Code Snippet"
            style={type === 'code' ? { color: 'var(--primary-color)', background: 'var(--surface-color)' } : {}}
          >
            <CodeIcon size={20} />
          </button>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={20} />
          <span>Save Note</span>
        </button>
      </div>

      <div className="editor-body">
        <input
          type="text"
          className="editor-title-input"
          placeholder="Note Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ color: color || 'white' }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap' }}>
          <div className="color-picker">
            <div 
              className={`color-dot ${!color ? 'active' : ''}`}
              style={{ background: 'var(--surface-color)', border: '1px solid var(--surface-border)' }}
              onClick={() => setColor('')}
            />
            {COLORS.map(c => (
              <div 
                key={c}
                className={`color-dot ${color === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
            <TagIcon size={16} color="var(--text-muted)" />
            {tags.map(tag => (
              <span key={tag} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem' }}>
                {tag}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)} />
              </span>
            ))}
            <input 
              type="text" 
              placeholder="Add tag..." 
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
              style={{ background: 'transparent', border: 'none', color: 'white', width: '80px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {type === 'text' && (
          <textarea
            className="editor-textarea"
            placeholder="Start typing your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ color: color || 'var(--text-main)' }}
          />
        )}
        
        {type === 'code' && (
          <textarea
            className="editor-textarea"
            placeholder="Paste your code snippet here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}
          />
        )}

        {type === 'checklist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            {checklist.map((item, index) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input 
                  type="checkbox" 
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(item.id)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <input 
                  type="text"
                  className="modern-input"
                  style={{ textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.6 : 1, padding: '0.5rem 1rem' }}
                  value={item.text}
                  onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                  placeholder="List item..."
                  autoFocus={index === checklist.length - 1 && !item.text}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && item.text) {
                      setChecklist([...checklist, { id: uuidv4(), text: '', completed: false }]);
                    }
                  }}
                />
                <button 
                  className="btn-icon" 
                  onClick={() => setChecklist(checklist.filter(i => i.id !== item.id))}
                  style={{ color: 'var(--danger-color)' }}
                >
                  <X size={18} />
                </button>
              </div>
            ))}
            <button 
              className="btn btn-ghost" 
              style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              onClick={() => setChecklist([...checklist, { id: uuidv4(), text: '', completed: false }])}
            >
              <Plus size={18} />
              <span>Add Item</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
