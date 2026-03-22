export type NoteType = 'text' | 'checklist' | 'code';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string; // Used for text or code
  checklist?: ChecklistItem[]; // Used for checklist type
  type: NoteType;
  color?: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  tags: string[];
}
