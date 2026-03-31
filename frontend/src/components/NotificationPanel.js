import { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, IndianRupee, ClipboardList, GraduationCap, Calendar, X } from 'lucide-react';

const iconMap = {
  alert: AlertTriangle,
  fee: IndianRupee,
  leave: ClipboardList,
  academic: GraduationCap,
  event: Calendar,
};
const colorMap = {
  alert: { bg: 'var(--red-dim)', color: 'var(--red)' },
  fee: { bg: 'var(--orange-dim)', color: 'var(--orange)' },
  leave: { bg: 'var(--green-dim)', color: 'var(--green)' },
  academic: { bg: 'var(--blue-dim)', color: 'var(--blue)' },
  event: { bg: 'var(--purple-dim)', color: 'var(--purple)' },
};

const mockNotifications = [
  { id: 1, type: 'alert', text: 'Sunita Devi absent again without leave', time: '10 min ago', read: false },
  { id: 2, type: 'fee', text: 'Rahul Gupta overdue crossed 90 days', time: '1 hr ago', read: false },
  { id: 3, type: 'leave', text: "Ramesh's leave request pending approval", time: '2 hrs ago', read: false },
  { id: 4, type: 'academic', text: 'Class 6B math test results available', time: '3 hrs ago', read: true },
  { id: 5, type: 'event', text: 'Annual Day planning meeting tomorrow', time: 'Yesterday', read: true },
  { id: 6, type: 'fee', text: '8 students overdue 60+ days', time: 'Yesterday', read: true },
  { id: 7, type: 'alert', text: 'Bus #3 insurance renewal in 7 days', time: '2 days ago', read: true },
];

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(mockNotifications);
  const ref = useRef(null);

  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="ef-notif-wrap" ref={ref}>
      <button className="ef-notif-btn" onClick={() => setOpen(!open)} data-testid="notification-bell">
        <Bell size={17} />
        {unreadCount > 0 && <span className="ef-notif-badge" data-testid="notif-badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="ef-notif-panel" data-testid="notification-panel">
          <div className="ef-notif-header">
            <span className="font-heading">Notifications</span>
            <div className="ef-notif-header-actions">
              {unreadCount > 0 && <button className="ef-notif-mark-all" onClick={markAllRead} data-testid="mark-all-read">Mark all read</button>}
              <button className="ef-notif-close" onClick={() => setOpen(false)}><X size={14} /></button>
            </div>
          </div>
          <div className="ef-notif-list">
            {notifs.map(n => {
              const Icon = iconMap[n.type] || Bell;
              const colors = colorMap[n.type] || colorMap.alert;
              return (
                <div key={n.id} className={`ef-notif-item ${n.read ? '' : 'unread'}`} onClick={() => markRead(n.id)} data-testid={`notif-item-${n.id}`}>
                  <div className="ef-notif-ico" style={{ background: colors.bg }}>
                    <Icon size={13} style={{ color: colors.color }} />
                  </div>
                  <div className="ef-notif-content">
                    <div className="ef-notif-text">{n.text}</div>
                    <div className="ef-notif-time">{n.time}</div>
                  </div>
                  {!n.read && <div className="ef-notif-dot" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
