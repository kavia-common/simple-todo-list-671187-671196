const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' }
];

/**
 * @param {{
 *  activeFilter: 'all'|'active'|'completed',
 *  onChange: (filter: 'all'|'active'|'completed') => void,
 *  onClearCompleted: () => void
 *  remaining: number
 * }} props
 */
// PUBLIC_INTERFACE
export default function Filters({ activeFilter, onChange, onClearCompleted, remaining }) {
  /** Filter control group and clear completed button */
  return (
    <div className="footer-bar" role="region" aria-label="Todo filters and actions">
      <span className="badge" aria-live="polite">{remaining} remaining</span>
      <div className="filters" role="tablist" aria-label="Filters">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => onChange(f.id)}
            aria-pressed={activeFilter === f.id}
            role="tab"
            aria-selected={activeFilter === f.id}
          >
            {f.label}
          </button>
        ))}
      </div>
      <button className="btn" onClick={onClearCompleted} aria-label="Clear completed">
        Clear Completed
      </button>
    </div>
  );
}
