/**
 * Shared ToolPage layout wrapper
 */
import React from 'react';
import { RefreshCw } from 'lucide-react';

export function ToolPage({ title, subtitle, actions, children, onRefresh, loading }) {
  return (
    <div style={{ padding: '20px 24px', overflowY: 'auto', height: '100%', background: '#0A0A0F' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 12, color: '#64748B' }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {actions}
          {onRefresh && (
            <button onClick={onRefresh} style={{ background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '6px 12px', color: '#94A3B8', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <RefreshCw size={11} style={loading ? { animation: 'spin 0.8s linear infinite' } : {}} />
              Refresh
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export function StatCard({ value, label, color = '#3B82F6', sublabel, small }) {
  return (
    <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 10, padding: small ? '10px 12px' : '14px 16px' }}>
      <div style={{ fontSize: small ? 18 : 22, fontWeight: 700, color, fontFamily: 'Outfit, sans-serif' }}>{value}</div>
      <div style={{ fontSize: 9, color: '#64748B', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{sublabel}</div>}
    </div>
  );
}

export function DataTable({ title, headers, rows, emptyMsg = 'No data found' }) {
  return (
    <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 11, overflow: 'hidden', marginBottom: 16 }}>
      {title && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #222230' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 13, color: '#E2E8F0' }}>{title}</span>
        </div>
      )}
      {rows.length === 0 ? (
        <div style={{ padding: 28, textAlign: 'center', color: '#64748B', fontSize: 12 }}>{emptyMsg}</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 9.5, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#0F0F1A', borderBottom: '1px solid #222230' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid #1A1A24' : 'none' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '9px 14px', fontSize: 12, color: '#94A3B8' }}>
                      {typeof cell === 'object' ? cell : String(cell ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function Badge({ text, color = 'blue' }) {
  const colors = {
    green: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', border: 'rgba(16,185,129,0.25)' },
    red: { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', border: 'rgba(239,68,68,0.25)' },
    yellow: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
    blue: { bg: 'rgba(59,130,246,0.1)', text: '#60A5FA', border: 'rgba(59,130,246,0.25)' },
    purple: { bg: 'rgba(139,92,246,0.1)', text: '#A78BFA', border: 'rgba(139,92,246,0.25)' },
    gray: { bg: 'rgba(100,116,139,0.1)', text: '#64748B', border: 'rgba(100,116,139,0.25)' },
  };
  const c = colors[color] || colors.blue;
  return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{text}</span>;
}

export function ComingSoon({ toolName }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', gap: 12, color: '#64748B' }}>
      <div style={{ width: 56, height: 56, borderRadius: 12, background: '#161622', border: '1px solid #222230', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🔧</div>
      <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#94A3B8', fontSize: 16, fontWeight: 600 }}>{toolName}</h3>
      <p style={{ fontSize: 12, color: '#475569', textAlign: 'center', maxWidth: 300 }}>This tool is part of Phase 2. The UI skeleton is ready. Backend integration coming soon.</p>
    </div>
  );
}

export function FormField({ label, type = 'text', value, onChange, placeholder, options, required }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 10, color: '#64748B', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}{required && ' *'}</label>
      {type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }}>
          <option value="">Select...</option>
          {(options || []).map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ width: '100%', background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none', resize: 'vertical' }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: '100%', background: '#161622', border: '1px solid #222230', borderRadius: 7, padding: '8px 12px', color: '#E2E8F0', fontSize: 12, outline: 'none' }} />
      )}
    </div>
  );
}

export function ActionBtn({ label, onClick, variant = 'primary', icon, disabled }) {
  const styles = {
    primary: { background: '#3B82F6', color: '#fff', border: 'none' },
    success: { background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' },
    danger: { background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' },
    secondary: { background: '#161622', color: '#94A3B8', border: '1px solid #222230' },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...s, borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 5, opacity: disabled ? 0.5 : 1, transition: 'opacity 0.15s' }}>
      {icon}{label}
    </button>
  );
}

export function useToolData(fetcher, deps = []) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, deps);

  React.useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}
