import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/config";

const makeNotice = (type, title, message, actionPath = "") => ({
  type,
  title,
  message,
  actionPath,
});

const noticeTone = (type) => {
  if (type === "danger") return "border-[var(--danger)]/20 bg-[var(--danger-bg)] text-[var(--danger)]";
  if (type === "warning") return "border-[var(--warning)]/20 bg-[var(--warning-bg)] text-[var(--warning)]";
  return "border-[var(--primary-border)]/30 bg-[var(--primary-light)] text-[var(--primary)]";
};

const NotificationBell = ({ user }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    const loadNotices = async () => {
      try {
        if (user.role === "admin") {
          const res = await axios.get(`${API_URL}/admin/stats`, { withCredentials: true });
          const adminNotices = (res.data.notifications || []).map((notice) => ({
            ...notice,
            actionPath:
              notice.title?.includes("Provider") ? "/admin" :
              notice.title?.includes("booking") ? "/admin" :
              notice.title?.includes("Inactive") ? "/admin" :
              notice.title?.includes("Blocked") ? "/admin" : "",
          }));
          if (active) setNotices(adminNotices);
          return;
        }

        if (user.role === "provider") {
          const [servicesRes, bookingsRes] = await Promise.all([
            axios.get(`${API_URL}/services/provider/my`, { withCredentials: true }),
            axios.get(`${API_URL}/bookings/provider`, { withCredentials: true }),
          ]);

          const service = servicesRes.data?.[0];
          const pendingCount = bookingsRes.data?.filter((booking) => booking.status === "pending").length || 0;
          const providerNotices = [
            ...(service && !service.isActive
              ? [makeNotice("danger", "Service inactive", "Customers cannot book you until your service is active.", "/provider-dashboard")]
              : []),
            ...(pendingCount
              ? [makeNotice("warning", "Booking requests waiting", `${pendingCount} booking request${pendingCount === 1 ? "" : "s"} need your response.`, "/provider-dashboard")]
              : []),
          ];

          if (active) setNotices(providerNotices);
          return;
        }

        const bookingsRes = await axios.get(`${API_URL}/bookings/my`, { withCredentials: true });
        const pendingCount = bookingsRes.data?.filter((booking) => booking.status === "pending").length || 0;
        const acceptedCount = bookingsRes.data?.filter((booking) => booking.status === "accepted").length || 0;
        const customerNotices = [
          ...(pendingCount
            ? [makeNotice("warning", "Requests pending", `${pendingCount} booking request${pendingCount === 1 ? "" : "s"} are waiting for provider acceptance.`, "/profile")]
            : []),
          ...(acceptedCount
            ? [makeNotice("info", "Bookings accepted", `${acceptedCount} booking${acceptedCount === 1 ? "" : "s"} are accepted and scheduled.`, "/profile")]
            : []),
        ];

        if (active) setNotices(customerNotices);
      } catch {
        if (active) setNotices([]);
      }
    };

    loadNotices();

    return () => {
      active = false;
    };
  }, [user]);

  const unreadCount = useMemo(() => notices.length, [notices]);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--primary)] border border-[var(--border)] transition duration-200 cursor-pointer"
        aria-label="Open notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-2rem)] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-xl p-4 z-50">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-extrabold text-[var(--text)]">Notifications</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{unreadCount} Active</span>
          </div>

          <div className="space-y-3 mt-3">
            {notices.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] py-4 text-center">No active notifications.</p>
            ) : (
              notices.map((notice) => (
                <button
                  key={`${notice.title}-${notice.message}`}
                  type="button"
                  onClick={() => {
                    if (notice.actionPath) navigate(notice.actionPath);
                    setOpen(false);
                  }}
                  className={`w-full text-left border rounded-xl p-3 transition hover:scale-[1.01] cursor-pointer ${noticeTone(notice.type)}`}
                >
                  <p className="text-xs font-extrabold">{notice.title}</p>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{notice.message}</p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
