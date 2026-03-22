import { createClient } from '@supabase/supabase-js';
import type { Note } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local file");
}

export const supabase = createClient(supabaseUrl || 'http://localhost', supabaseKey || 'dummy');

// Map DB snake_case columns back to Frontend camelCase
const mapFromDB = (data: any): Note => ({
  id: data.id,
  title: data.title,
  content: data.content,
  type: data.type,
  checklist: data.checklist,
  color: data.color,
  tags: data.tags,
  pinned: data.pinned,
  createdAt: data.created_at,
  updatedAt: data.updated_at
});

// Map Frontend camelCase to DB snake_case columns
const mapToDB = (note: Partial<Note>) => ({
  ...(note.id ? { id: note.id } : {}),
  title: note.title,
  content: note.content,
  type: note.type,
  checklist: note.checklist,
  color: note.color,
  tags: note.tags,
  pinned: note.pinned,
  created_at: note.createdAt,
  updated_at: note.updatedAt
});

export const getNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
  return data ? data.map(mapFromDB) : [];
};

export const createNote = async (note: Note): Promise<Note> => {
  const { data, error } = await supabase
    .from('notes')
    .insert([mapToDB(note)])
    .select()
    .single();
    
  if (error) throw error;
  return mapFromDB(data);
};

export const updateNote = async (note: Note): Promise<Note> => {
  const { data, error } = await supabase
    .from('notes')
    .update(mapToDB(note))
    .eq('id', note.id)
    .select()
    .single();
    
  if (error) throw error;
  return mapFromDB(data);
};

export const deleteNote = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
