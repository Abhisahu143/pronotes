import React from 'react';
import { FileEdit } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <FileEdit size={40} />
      </div>
      <h2>Start capturing your ideas</h2>
      <p>Create your first note to begin organizing your thoughts, tasks, and code snippets in a beautiful environment.</p>
      <button className="btn btn-primary" onClick={onCreateNew}>
        Create Note
      </button>
    </div>
  );
};

export default EmptyState;
