import { useEffect, useRef, useState, useCallback } from "react";

/**
 * @param {{ 
 *  todo: { id: string, text: string, completed: boolean },
 *  onToggle: (id: string) => void,
 *  onDelete: (id: string) => void,
 *  onUpdate: (id: string, text: string) => void
 * }} props
 */
// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  /** A single todo row with checkbox, text, and actions; supports inline editing. */
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(todo.text);
  }, [todo.text]);

  const beginEdit = useCallback(() => {
    setDraft(todo.text);
    setEditing(true);
  }, [todo.text]);

  const cancelEdit = useCallback(() => {
    setDraft(todo.text);
    setEditing(false);
  }, [todo.text]);

  const commitEdit = useCallback(() => {
    const value = draft.trim();
    if (value && value !== todo.text) {
      onUpdate(todo.id, value);
    }
    setEditing(false);
  }, [draft, onUpdate, todo.id, todo.text]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <li className="todo-item" role="listitem" aria-label={`Todo: ${todo.text}`}>
      <button
        className={`checkbox ${todo.completed ? 'completed' : ''}`}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        aria-pressed={todo.completed}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed ? '✓' : ''}
      </button>

      {!editing ? (
        <p
          className={`todo-text ${todo.completed ? 'completed' : ''}`}
          onDoubleClick={beginEdit}
          tabIndex={0}
          aria-label={`Todo text: ${todo.text}. ${todo.completed ? 'Completed.' : 'Active.'} Double click to edit.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') beginEdit();
          }}
        >
          {todo.text}
        </p>
      ) : (
        <input
          ref={inputRef}
          className="input"
          aria-label="Edit todo"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={onKeyDown}
        />
      )}

      <div className="todo-actions" aria-label="Todo actions">
        {!editing && (
          <button
            className="icon-btn"
            onClick={beginEdit}
            aria-label="Edit todo"
            title="Edit"
          >
            <span className="icon primary" aria-hidden>✎</span>
          </button>
        )}
        <button
          className="icon-btn"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
          title="Delete"
        >
          <span className="icon danger" aria-hidden>🗑</span>
        </button>
      </div>
    </li>
  );
}
