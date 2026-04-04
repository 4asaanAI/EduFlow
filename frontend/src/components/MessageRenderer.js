import React from 'react';

function parseMarkdownText(text) {
  if (!text) return '';
  
  // Process line by line for tables and other block elements
  const lines = text.split('\n');
  let result = '';
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Detect markdown table
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      result += renderMarkdownTable(tableLines);
      continue;
    }
    
    // Headings
    if (line.startsWith('### ')) {
      result += `<h4 style="color:#fff;font-family:Outfit,sans-serif;font-size:0.9rem;font-weight:600;margin:12px 0 6px">${processInline(line.slice(4))}</h4>`;
    } else if (line.startsWith('## ')) {
      result += `<h3 style="color:#fff;font-family:Outfit,sans-serif;font-size:1rem;font-weight:600;margin:14px 0 8px">${processInline(line.slice(3))}</h3>`;
    } else if (line.startsWith('# ')) {
      result += `<h2 style="color:#fff;font-family:Outfit,sans-serif;font-size:1.1rem;font-weight:700;margin:16px 0 8px">${processInline(line.slice(2))}</h2>`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      result += `<li style="margin-bottom:3px;color:#94A3B8">${processInline(line.slice(2))}</li>`;
    } else if (line.match(/^\d+\.\s/)) {
      result += `<li style="margin-bottom:3px;color:#94A3B8">${processInline(line.replace(/^\d+\.\s/, ''))}</li>`;
    } else if (line.trim() === '---' || line.trim() === '***') {
      result += `<hr style="border:none;border-top:1px solid #222230;margin:12px 0"/>`;
    } else if (line.trim() === '') {
      result += '<br/>';
    } else {
      result += `<p style="margin-bottom:6px;color:#94A3B8">${processInline(line)}</p>`;
    }
    i++;
  }
  return result;
}

function renderMarkdownTable(lines) {
  const rows = lines.map(l => l.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim()));
  const headers = rows[0] || [];
  const bodyRows = rows.filter((_, i) => i > 1); // skip separator row
  
  let html = `<div style="overflow-x:auto;margin:10px 0"><table style="width:100%;border-collapse:collapse;font-size:12px">`;
  html += '<thead><tr>';
  headers.forEach(h => {
    html += `<th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;background:#0F0F1A;border-bottom:1px solid #222230">${h}</th>`;
  });
  html += '</tr></thead><tbody>';
  bodyRows.forEach((row, ri) => {
    html += `<tr style="border-bottom:${ri < bodyRows.length - 1 ? '1px solid #1A1A24' : 'none'}">`;
    row.forEach((cell, ci) => {
      const isAmount = cell.startsWith('₹') && cell !== '₹0';
      const color = isAmount ? '#F59E0B' : '#94A3B8';
      html += `<td style="padding:8px 12px;font-size:12px;color:${color}">${processInline(cell)}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function processInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#E2E8F0;font-weight:600">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#94A3B8">$1</em>')
    .replace(/`(.+?)`/g, '<code style="font-family:JetBrains Mono,monospace;background:#1C1C28;padding:2px 5px;border-radius:4px;font-size:0.85em;color:#a5b4fc">$1</code>')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '<a style="color:#3B82F6">$1</a>');
}

function StatGrid({ stats }) {
  const colorMap = {
    green: { bg: 'rgba(16,185,129,0.1)', text: '#10B981', border: 'rgba(16,185,129,0.2)' },
    red: { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', border: 'rgba(239,68,68,0.2)' },
    blue: { bg: 'rgba(59,130,246,0.1)', text: '#60A5FA', border: 'rgba(59,130,246,0.2)' },
    yellow: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', border: 'rgba(245,158,11,0.2)' },
    purple: { bg: 'rgba(139,92,246,0.1)', text: '#A78BFA', border: 'rgba(139,92,246,0.2)' },
    default: { bg: 'rgba(255,255,255,0.05)', text: '#E2E8F0', border: 'rgba(255,255,255,0.1)' },
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: 10, margin: '12px 0' }}>
      {stats.map((stat, i) => {
        const c = colorMap[stat.color] || colorMap.default;
        return (
          <div key={i} style={{
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: 10, padding: '12px 14px',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: c.text, fontFamily: 'Outfit, sans-serif', lineHeight: 1.2 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 10, color: '#64748B', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DataTable({ title, headers, rows }) {
  return (
    <div style={{ background: '#161622', border: '1px solid #222230', borderRadius: 10, overflow: 'hidden', margin: '12px 0' }}>
      {title && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid #222230', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 13, color: '#E2E8F0' }}>{title}</span>
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  padding: '8px 12px', textAlign: 'left',
                  fontSize: 10, fontWeight: 700, color: '#64748B',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: '#0F0F1A', borderBottom: '1px solid #222230',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid #1A1A24' : 'none' }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: '9px 12px', fontSize: 12, color: '#94A3B8',
                  }}>
                    {typeof cell === 'string' && cell.startsWith('₹') && cell !== '₹0'
                      ? <span style={{ color: isNegative(cell) ? '#EF4444' : '#E2E8F0', fontWeight: 500 }}>{cell}</span>
                      : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function isNegative(val) {
  return false; // simplified
}

function AlertsList({ items }) {
  const typeStyles = {
    warning: { icon: '⚠️', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: '#FCD34D' },
    critical: { icon: '🔴', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', text: '#FCA5A5' },
    success: { icon: '✅', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#6EE7B7' },
    info: { icon: 'ℹ️', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', text: '#93C5FD' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '10px 0' }}>
      {items.map((item, i) => {
        const s = typeStyles[item.type] || typeStyles.info;
        return (
          <div key={i} style={{
            background: s.bg, border: `1px solid ${s.border}`,
            borderRadius: 8, padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 12 }}>{s.icon}</span>
            <span style={{ fontSize: 12, color: s.text }}>{item.text}</span>
          </div>
        );
      })}
    </div>
  );
}

function ActionButtons({ buttons, onActionButton }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
      {buttons.map((btn, i) => (
        <button
          key={i}
          data-testid={`action-btn-${btn.action || i}`}
          onClick={() => onActionButton && onActionButton(btn.action, btn.params || {}, btn.label)}
          style={{
            background: '#161622',
            border: '1px solid #3B82F6',
            borderRadius: 7,
            padding: '7px 14px',
            color: '#93C5FD',
            fontSize: 12,
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#161622'; }}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

export default function MessageRenderer({ message, isStreaming, onActionButton }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <div
          data-testid="user-message"
          style={{
            background: '#1C1C28',
            border: '1px solid #222230',
            borderRadius: '16px 16px 4px 16px',
            padding: '10px 16px',
            maxWidth: '80%',
            color: '#E2E8F0',
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  // AI message
  const richBlocks = message.richBlocks || message.rich_content?.rich_blocks || [];
  const actionButtons = message.actionButtons || message.rich_content?.action_buttons || message.actions || [];

  return (
    <div
      data-testid="ai-message"
      style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'flex-start' }}
    >
      {/* Avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 13, color: '#818CF8',
      }}>E</div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Text content */}
        {message.content && (
          <div
            className="prose-chat"
            dangerouslySetInnerHTML={{ __html: parseMarkdownText(message.content) }}
          />
        )}

        {/* Streaming cursor */}
        {isStreaming && (
          <span style={{ display: 'inline-block', width: 2, height: 14, background: '#818CF8', marginLeft: 2, animation: 'pulse-dot 1s infinite' }} />
        )}

        {/* Rich blocks */}
        {richBlocks.map((block, i) => {
          if (block.type === 'stat_grid') {
            return <StatGrid key={i} stats={block.stats} />;
          } else if (block.type === 'table') {
            return <DataTable key={i} title={block.title} headers={block.headers} rows={block.rows} />;
          } else if (block.type === 'alerts') {
            return <AlertsList key={i} items={block.items} />;
          }
          return null;
        })}

        {/* Action buttons */}
        {actionButtons && actionButtons.length > 0 && (
          <ActionButtons buttons={actionButtons} onActionButton={onActionButton} />
        )}
      </div>
    </div>
  );
}
