import { useCallback, useEffect, useMemo, useState } from 'react';
import './styles/theme.css';
import './styles/app.css';
import TodoInput from './components/TodoInput';
import TodoItem from './components/TodoItem';
import Filters from './components/Filters';
import { loadTodos, saveTodos } from './lib/storage';

// PUBLIC_INTERFACE
export default function App() {
  /** Main Todo App with add/edit/delete/complete, filters and persistence. */
  const [todos, setTodos] = useState(() => loadTodos());
  const [filter, setFilter] = useState('all');

  // Persist on change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Handlers
  const addTodo = useCallback((text) => {
    const newTodo = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      text,
      completed: false
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter(t => t.id !== id));
  }, []);

  const updateTodo = useCallback((id, text) => {
    setTodos((prev) => prev.map(t => (t.id === id ? { ...t, text } : t)));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter(t => !t.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remaining = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  return (
    <div className="container app-shell">
      <div className="card" role="application" aria-label="Todo application">
        <header className="header">
          <h1 className="title">Ocean Todos</h1>
          <p className="subtitle">A clean, modern list to organize your day</p>
        </header>

        <TodoInput onAdd={addTodo} />

        <ul className="todo-list" role="list" aria-label="Todo list">
          {filteredTodos.length === 0 && (
            <div className="empty" role="status" aria-live="polite">
              No todos here yet. Add one above!
            </div>
          )}
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
        </ul>

        <Filters
          activeFilter={filter}
          onChange={setFilter}
          onClearCompleted={clearCompleted}
          remaining={remaining}
        />
      </div>
    </div>
  );
}
