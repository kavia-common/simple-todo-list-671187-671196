import { useState, useCallback } from "react";

/**
 * @param {{
 *  onAdd: (text: string) => void
 * }} props
 */
// PUBLIC_INTERFACE
export default function TodoInput({ onAdd }) {
  /** Input row for creating new todos */
  const [text, setText] = useState("");

  const submit = useCallback(() => {
    const t = text.trim();
    if (!t) return;
    onAdd(t);
    setText("");
  }, [onAdd, text]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="input-row" role="region" aria-label="Add todo">
      <label htmlFor="new-todo" className="sr-only">New todo</label>
      <input
        id="new-todo"
        className="input"
        placeholder="What needs to be done?"
        aria-label="New todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button className="btn btn-primary" onClick={submit} aria-label="Add todo">
        Add
      </button>
    </div>
  );
}
