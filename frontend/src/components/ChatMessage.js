import { Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { tools } from '@/data/mockData';

const iconMap = {
  Clock, IndianRupee, Users, BarChart3, AlertTriangle, FileText, Activity, Megaphone, ClipboardList, UserPlus,
};

const toolIdSet = new Set(tools.map(t => t.id));

function processToolLinks(html) {
  if (!html) return html;
  return html.replace(/\/([\w-]+)/g, (match, slug) => {
    const toolId = slug.replace(/-/g, '_');
    if (toolIdSet.has(toolId)) {
      return `<span class="ef-tool-link" data-tool-id="${toolId}">${match}</span>`;
    }
    return match;
  });
}

function RenderHTML({ html }) {
  return <span dangerouslySetInnerHTML={{ __html: processToolLinks(html) }} />;
}

function StatCard({ stat }) {
  return (
    <div className={`ef-stat ${stat.color || ''}`} data-testid={`stat-${stat.label?.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="ef-stat-value font-heading">{stat.value}</div>
      <div className="ef-stat-label">{stat.label}</div>
    </div>
  );
}

function DataTable({ table }) {
  if (!table) return null;
  return (
    <table className="ef-table">
      <thead>
        <tr>
          {table.headers.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} style={cell.color ? { color: `var(--${cell.color})` } : undefined}>
                {cell.text}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChartWidget({ chart }) {
  if (!chart) return null;
  return (
    <div className="ef-chart-wrap">
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={chart.data} margin={{ top: 8, right: 12, left: -20, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#636160', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#636160', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#15151f',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 8,
              fontSize: 12,
              color: '#ededeb',
            }}
          />
          <Line
            type="monotone"
            dataKey="students"
            stroke="#5b7bf5"
            strokeWidth={2}
            dot={{ fill: '#5b7bf5', r: 3 }}
            name="Students"
          />
          {chart.data[0]?.attendance !== undefined && (
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: '#34d399', r: 3 }}
              name="Attendance %"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DataWidget({ widget }) {
  const Icon = iconMap[widget.icon] || Clock;
  return (
    <div className="ef-widget" data-testid={`widget-${widget.title?.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`}>
      <div className="ef-widget-header">
        <div className="ef-widget-icon">
          <Icon size={12} />
        </div>
        <div className="ef-widget-title">{widget.title}</div>
      </div>

      {widget.stats && (
        <div className="ef-stats">
          {widget.stats.map((stat, i) => <StatCard key={i} stat={stat} />)}
        </div>
      )}

      {widget.chart && <ChartWidget chart={widget.chart} />}

      {widget.table && <DataTable table={widget.table} />}

      {widget.subSection && (
        <div className="ef-widget-sub">
          <div className="ef-widget-sub-title">{widget.subSection.title}</div>
          <DataTable table={widget.subSection.table} />
        </div>
      )}

      {widget.footer && (
        <div className="ef-widget-footer">{widget.footer}</div>
      )}
    </div>
  );
}

export default function ChatMessage({ message, onAction, onToolClick, index }) {
  const isUser = message.role === 'user';

  const handleBubbleClick = (e) => {
    const link = e.target.closest('.ef-tool-link');
    if (link && onToolClick) {
      e.preventDefault();
      const toolId = link.dataset.toolId;
      if (toolId) onToolClick(toolId);
    }
  };

  return (
    <div
      className={`ef-msg ${isUser ? 'user' : 'ai'}`}
      style={{ animationDelay: `${(index || 0) * 0.05}s` }}
      data-testid={`chat-message-${index}`}
    >
      <div className={`ef-avatar ${isUser ? 'user-av' : 'ai-av'}`}>
        {isUser ? 'A' : 'E'}
      </div>
      <div className="ef-bubble" onClick={handleBubbleClick}>
        {/* Main text with optional tags */}
        <p>
          <RenderHTML html={message.text} />
          {message.tags && message.tags.map((tag, i) => {
            const TagIcon = iconMap[tag.icon] || Clock;
            return (
              <span key={i}>
                {i === 0 ? ' ' : ' and '}
                <span className="ef-tag" data-testid={`tag-${tag.name.replace(/\s+/g, '-').toLowerCase()}`}>
                  <TagIcon size={11} />
                  {' '}{tag.name}
                </span>
              </span>
            );
          })}
        </p>

        {/* Widgets */}
        {message.widgets && message.widgets.map((widget, i) => (
          <DataWidget key={i} widget={widget} />
        ))}

        {/* Follow-up text */}
        {message.followUp && (
          <p style={{ marginTop: 10 }}>
            <RenderHTML html={message.followUp} />
          </p>
        )}

        {/* Action buttons */}
        {message.actions && (
          <div className={`ef-actions ${message.isQuickReply ? 'quick-reply' : ''}`}>
            {message.actions.map((action, i) => (
              <button
                key={i}
                className={`ef-action-btn ${message.isQuickReply ? 'quick-reply-btn' : ''}`}
                onClick={() => onAction(action, message.isQuickReply)}
                data-testid={`action-btn-${action.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`}
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
